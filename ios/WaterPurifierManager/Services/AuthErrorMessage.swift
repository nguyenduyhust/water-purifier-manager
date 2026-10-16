import AuthenticationServices
import FirebaseAuth
import Foundation
import GoogleSignIn

enum AuthErrorMessage {
    /// A user-facing message for an auth error, or nil when the user simply cancelled.
    static func message(for error: Error) -> String? {
        if let error = error as? ASAuthorizationError, error.code == .canceled {
            return nil
        }
        if let error = error as? GIDSignInError, error.code == .canceled {
            return nil
        }

        let nsError = error as NSError
        guard nsError.domain == AuthErrorDomain, let code = AuthErrorCode(rawValue: nsError.code) else {
            return error.localizedDescription
        }

        switch code {
        case .wrongPassword, .invalidCredential:
            return String(localized: "Invalid email or password")
        case .userNotFound:
            return String(localized: "No account found with this email")
        case .emailAlreadyInUse:
            return String(localized: "This email is already in use")
        case .weakPassword:
            return String(localized: "Password is too weak")
        case .tooManyRequests:
            return String(localized: "Too many attempts. Please try again later.")
        case .invalidEmail:
            return String(localized: "Invalid email address")
        case .networkError:
            return String(localized: "Network error. Check your connection and try again.")
        default:
            return String(localized: "An unexpected error occurred")
        }
    }
}
