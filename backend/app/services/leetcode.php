<?php
/**
 * Script: Browser Emulator
 * Author: Adel Srour <code@adel.dev>
 * GitHub: https://github.com/adelsrour
 * License: MIT
 */

require_once __DIR__ . '/profile.php';

class Leetcode extends Profile
{
    private $mh; #Curl mutli handler
    private $mh_handlers = []; #Storage for single curl handlers
    public $rps = 5; #default requests per second
    public $defaultMonths = 3;
    public function __construct()
    {
        #init curl mh
        $this->mh = curl_multi_init();
    }

    public function __destruct()
    {
        #close curl mh
        curl_multi_close($this->mh);
    }

    public function initRequest($usernames)
    {
        foreach ($usernames as $userInfo) {
            $username = $userInfo[0];
            $userTitle = $userInfo[1];

            #init single curl handler
            $ch = curl_init();
            #Leetcode graphq api
            curl_setopt($ch, CURLOPT_URL, 'https://leetcode.com/graphql/');
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_POST, true);
            #firefox headers
            curl_setopt($ch, CURLOPT_HTTPHEADER, [
                'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:136.0) Gecko/20100101 Firefox/136.0',
                'Accept: */*',
                'Accept-Language: en-US,en;q=0.5',
                'Accept-Encoding: gzip, deflate, br, zstd',
                'Content-Type: application/json',
                'DNT: 1',
                'Sec-GPC: 1',
                'Connection: keep-alive',
                'Sec-Fetch-Dest: empty',
                'Sec-Fetch-Mode: cors',
                'Sec-Fetch-Site: same-origin',
                'TE: trailers'
            ]);
            curl_setopt($ch, CURLOPT_ENCODING, "gzip,deflate,br");

            #leetcode graph api query
            $data = [
                'query' => "query userProfileCalendar(\$username: String!, \$year: Int) { matchedUser(username: \$username) { profile { realName userAvatar ranking } submitStats: submitStatsGlobal { acSubmissionNum { difficulty count } } userCalendar(year: \$year) { activeYears streak totalActiveDays dccBadges { timestamp badge { name icon } } submissionCalendar } } }",
                'variables' => ['username' => $username],
                'operationName' => 'userProfileCalendar'
            ];
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));

            #add our request to mh
            curl_multi_add_handle($this->mh, $ch);
            #Push the handler into our storage
            $this->mh_handlers[] = [$username, $userTitle, $ch];
        }
        return $this->execRequest();
    }

    private function execRequest()
    {
        $running = null; # running idf
        $users_data = [];

        #Execute every single request in our mh handler
        foreach ($this->mh_handlers as $reqInfo) {
            #execute requests per second per single handler (1 handler do x requests)
            $batch = array_splice($this->mh_handlers, 0, $this->rps); #batch size
            do {
                curl_multi_exec($this->mh, $running);
                curl_multi_select($this->mh);
            } while ($running > 0);

            foreach ($batch as $reqInfo) {
                #get requested user info
                $username = $reqInfo[0];
                $userTitle = $reqInfo[1];
                $ch = $reqInfo[2];

                #Get response
                $response = curl_multi_getcontent($ch);
                $error_code = curl_multi_errno($this->mh);
                $network_error = [];
                if ($error_code) {
                    $network_error = [true, curl_multi_strerror($error_code)];
                }

                #Remove the single handler from mh
                curl_multi_remove_handle($this->mh, $ch);
                #Close the single handler
                curl_close($ch);

                #Generate user data
                $users_data[] = $this->genProfile($response, $username, $userTitle, $network_error, $this->defaultMonths);
            }

        }

        return $users_data;
    }
}