<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Setting;
use Illuminate\Support\Facades\Validator;

class ProfileController extends Controller
{
    /**
     * Récupère le profil de l'utilisateur connecté
     */
    public function show()
    {
        $user = auth()->user();
        $settings = $user->settings;

        return response()->json([
            'user' => $user,
            'settings' => $settings
        ]);
    }

    /**
     * Met à jour le profil de l'utilisateur
     */
    public function update(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . auth()->id(),
            'phone' => 'nullable|string|max:20',
            'avatar' => 'nullable|image|max:2048',
            'notification_settings' => 'nullable|array',
            'payment_methods' => 'nullable|array',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Erreur de validation',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = auth()->user();
        
        // Mise à jour des informations utilisateur
        $user->update([
            'name' => $request->name,
            'email' => $request->email,
        ]);

        // Gestion de l'avatar
        if ($request->hasFile('avatar')) {
            $path = $request->file('avatar')->store('avatars', 'public');
            $user->settings()->update(['avatar' => $path]);
        }

        // Mise à jour des paramètres
        $user->settings()->update([
            'phone' => $request->phone,
            'notification_settings' => $request->notification_settings,
            'payment_methods' => $request->payment_methods,
        ]);

        return response()->json([
            'message' => 'Profil mis à jour avec succès',
            'user' => $user->fresh(),
            'settings' => $user->settings
        ]);
    }

    /**
     * Met à jour uniquement les paramètres de notification
     */
    public function updateNotificationSettings(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'notification_settings' => 'required|array',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Erreur de validation',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = auth()->user();
        $user->settings()->update([
            'notification_settings' => $request->notification_settings
        ]);

        return response()->json([
            'message' => 'Paramètres de notification mis à jour avec succès',
            'settings' => $user->settings
        ]);
    }

    /**
     * Met à jour uniquement les méthodes de paiement
     */
    public function updatePaymentMethods(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'payment_methods' => 'required|array',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Erreur de validation',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = auth()->user();
        $user->settings()->update([
            'payment_methods' => $request->payment_methods
        ]);

        return response()->json([
            'message' => 'Méthodes de paiement mises à jour avec succès',
            'settings' => $user->settings
        ]);
    }
} 