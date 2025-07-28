<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        // Validate request data
        $validated = $request->validate([
            'username' => 'required|string',  // Fixed pipe operator (| instead of |)
            'password' => 'required|string',
        ]);

        // Attempt authentication
        if (Auth::attempt($validated)) {
            // Regenerate session for security
            $request->session()->regenerate();

            // Return success response
           return redirect()->intended(route('home'));
        }

        return back()->withErrors([
            'username' => 'The provided credentials do not match our records.',
        ])->onlyInput('username');
    }
}
