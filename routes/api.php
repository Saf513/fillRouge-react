// Routes du profil utilisateur
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/profile', [ProfileController::class, 'show']);
    Route::put('/profile', [ProfileController::class, 'update']);
    Route::patch('/profile/notifications', [ProfileController::class, 'updateNotificationSettings']);
    Route::patch('/profile/payment-methods', [ProfileController::class, 'updatePaymentMethods']);
}); 