// Import controllers
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\WishlistController;

// Routes du profil utilisateur
Route::middleware('auth:sanctum')->group(function () {
    // Profile routes
    Route::get('/profile', [ProfileController::class, 'show']);
    Route::put('/profile', [ProfileController::class, 'update']);
    Route::patch('/profile/notifications', [ProfileController::class, 'updateNotificationSettings']);
    Route::patch('/profile/payment-methods', [ProfileController::class, 'updatePaymentMethods']);

    // Wishlist routes
    Route::get('/wishlist', [WishlistController::class, 'index']);
    Route::post('/wishlist', [WishlistController::class, 'store']);
    Route::get('/wishlist/{id}', [WishlistController::class, 'show']);
    Route::put('/wishlist/{id}', [WishlistController::class, 'update']);
    Route::delete('/wishlist/{id}', [WishlistController::class, 'destroy']);
    Route::post('/wishlist/toggle', [WishlistController::class, 'toggle']);
    Route::patch('/wishlist/{id}/notifications', [WishlistController::class, 'toggleNotifications']);
    Route::delete('/wishlist', [WishlistController::class, 'clear']);
    Route::get('/wishlist/check/{courseId}', [WishlistController::class, 'check']);
}); 
