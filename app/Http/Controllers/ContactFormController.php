<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Http\Request;
use ReCaptcha\ReCaptcha;
use App\Http\Controllers\MailController;

class ContactFormController extends BaseController
{
    use AuthorizesRequests, ValidatesRequests;

    public function processForm(Request $request) {
        $validated = $this->validate($request, [
            'name' => 'required|min:3|max:255',
            'email' => 'required|email:rfc,dns,spoof',
            'message'=> 'required|max:600',
            'captchaValue'=> 'required',
        ]);

        // Verify the ReCaptcha response
        $recaptcha = new ReCaptcha(env('GRECAPTCHA_KEY'));
        $recaptchaResponse = $recaptcha->setExpectedAction('activityupliftcontactform')
                                        ->setScoreThreshold(0.7)
                                        ->verify($validated['captchaValue']);
        if (!$recaptchaResponse->isSuccess()) {
            // Handle ReCaptcha verification failure (e.g., return an error response)
            return response()->json([
                'success' => false,
                'message' => 'ReCaptcha Verification Failed. Looks like you are a robot.'
            ]);
        }
        
        $body = '
            You have a new contact request from:<br /><br />
            <table>
                <tr>
                    <td><b>Name:</b></td>
                    <td>'.$validated['name'].'</td>
                </tr>
                <tr>
                    <td><b>Email:</b></td>
                    <td>'.$validated['email'].'</td>
                </tr>
                <tr><td colspan="2"><b>Message:</b></td></tr>
                <tr><td colspan="2">'.nl2br($validated['message']).'</td></tr>
            </table>
        ';

        $response = MailController::sendMail('support@activityuplift.com', 'Activity Uplift | Website Contact Request', $body);
        $response->message = $response->success
            ? 'Contact info submitted successfully! We will be in touch shortly.' 
            : 'Contact info not submitted. Please try again or feel free to call us at any time.'
        ;
        return response()->json($response);
    }
}

?>
