<?php
/**
 * Script: Leetcode Profiler
 * Author: Adel Srour <code@adel.dev>
 * GitHub: https://github.com/adelsrour
 * License: MIT
 */

class Profile
{
    public function genProfile($response, $username, $userTitle, $network_error, $numMonths = 3)
    {

        #Decode the response
        $response = json_decode($response);

        $matchedUsers = $response->data;
        $errors = $response->errors[0]->message;
        $errors = htmlspecialchars($errors, ENT_QUOTES, "UTF-8");

        if ($network_error[0] == true) {
            $errors .= $network_error[1];
        }

        #Get submissions timestamp
        $submissions = $response->data->matchedUser->userCalendar->submissionCalendar;
        $submissions = json_decode($submissions, true);

        #Get user profile image and other details
        $profileImg = $response->data->matchedUser->profile->userAvatar;
        $ranking = $response->data->matchedUser->profile->ranking;
        $realName = $response->data->matchedUser->profile->realName;
        $solved = $response->data->submitStats->acSubmissionNum;

        #Set number of months to generate
        $currentDate = time();
        $months = array_reverse(array_combine(array_map(fn($i) => date("F", strtotime("first day of -$i month")), range(0, $numMonths - 1)), array_fill(0, $numMonths, [])));

        #Load active days into our months array
        $currYear = date("Y", $currentDate);
        foreach ($submissions as $timestamp => $submission) {
            date_default_timezone_set('UTC');
            $year = date('Y', $timestamp);
            $subMonth = date('F', $timestamp);
            $day = date('j', $timestamp);

            if (($year == $currYear) && isset($months[$subMonth])) {
                array_push($months[$subMonth], (int) $day);
            }
        }

        #Format the months so it suits the frontend
        $currMonth = date("F", $currentDate);
        foreach ($months as $monthName => $activeDays) {
            if ($currMonth == $monthName) {
                $numDays = (date("j", $currentDate));
            } else {
                #remove today
                $numDays = date('t', strtotime("$monthName 1, " . date('Y')));
            }
            $finalData['activedays'][] = [
                'monthName' => $monthName,
                'monthDays' => $numDays,
                'activeDays' => $activeDays,
                'missedDays' => (($numDays) - count($activeDays)),
            ];
        }

        if (empty($userTitle)) {
            $userTitle = htmlspecialchars($realName, ENT_QUOTES, 'UTF-8');
        }

        #Insert our profile data into final json
        $finalData['success'] = true;
        if ($matchedUsers == null || !empty($errors)) {
            $finalData['success'] = false;
            $finalData['message'] = $errors;
        }
        $finalData['username'] = htmlspecialchars($username, ENT_QUOTES, 'UTF-8');
        $finalData['usertitle'] = htmlspecialchars($userTitle, ENT_QUOTES, 'UTF-8');
        $finalData["profileimg"] = htmlspecialchars($profileImg, ENT_QUOTES, 'UTF-8');
        $finalData["ranking"] = htmlspecialchars($ranking, ENT_QUOTES, 'UTF-8');
        $finalData["solved"] = htmlspecialchars($solved, ENT_QUOTES, 'UTF-8');
        $finalData['ontrack'] = end($finalData['activedays'])['missedDays'] === 0 ? true : false;

        return $finalData;
    }
}