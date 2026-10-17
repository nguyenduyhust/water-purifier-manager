import AuthenticationServices
import FirebaseAuth
import FirebaseCore
import Foundation
import GoogleSignIn
import Observation
import UIKit

struct AuthUser: Equatable {
    let uid: String
    let email: String?
    let displayName: String?
    let isEmailVerified: Bool

    init(_ user: User) {
        self.init(uid: user.uid, email: user.email, displayName: user.displayName, isEmailVerified: user.isEmailVerified)
    }

    init(uid: String, email: String?, displayName: String?, isEmailVerified: Bool) {
        self.uid = uid
        self.email = email
        self.displayName = displayName
        self.isEmailVerified = isEmailVerified
    }

    /// How this user appears to others on shared purifiers and in history.
    var actor: Actor {
        Actor(id: uid, name: displayName ?? email ?? "")
    }
}

enum AuthSessionError: LocalizedError {
    case missingClientID
    case noPresenter
    case missingAppleToken

    var errorDescription: String? {
        String(localized: "An unexpected error occurred")
    }
}

@MainActor
@Observable
final class AuthSession {
    enum State: Equatable {
        case loading
        case signedOut
        case signedIn(AuthUser)
    }

    private(set) var state: State = .loading

    @ObservationIgnored private var listenerHandle: AuthStateDidChangeListenerHandle?
    @ObservationIgnored private var currentAppleNonce: String?

    func start() {
        guard listenerHandle == nil else { return }
        listenerHandle = Auth.auth().addStateDidChangeListener { [weak self] _, user in
            MainActor.assumeIsolated {
                self?.state = user.map { .signedIn(AuthUser($0)) } ?? .signedOut
            }
        }
    }

    // MARK: Email & password

    func signIn(email: String, password: String) async throws {
        try await Auth.auth().signIn(withEmail: email, password: password)
    }

    func signUp(name: String, email: String, password: String) async throws {
        let result = try await Auth.auth().createUser(withEmail: email, password: password)
        try await updateDisplayName(name, for: result.user)
    }

    func sendPasswordReset(email: String) async throws {
        try await Auth.auth().sendPasswordReset(withEmail: email)
    }

    // MARK: Google

    func signInWithGoogle() async throws {
        guard let clientID = FirebaseApp.app()?.options.clientID else { throw AuthSessionError.missingClientID }
        guard let presenter = Self.topViewController() else { throw AuthSessionError.noPresenter }

        GIDSignIn.sharedInstance.configuration = GIDConfiguration(clientID: clientID)
        let result = try await GIDSignIn.sharedInstance.signIn(withPresenting: presenter)
        guard let idToken = result.user.idToken?.tokenString else { throw AuthSessionError.missingClientID }

        let credential = GoogleAuthProvider.credential(
            withIDToken: idToken,
            accessToken: result.user.accessToken.tokenString
        )
        try await Auth.auth().signIn(with: credential)
    }

    // MARK: Apple

    func prepareAppleRequest(_ request: ASAuthorizationAppleIDRequest) {
        let nonce = AppleSignInNonce.make()
        currentAppleNonce = nonce
        request.requestedScopes = [.fullName, .email]
        request.nonce = AppleSignInNonce.sha256(nonce)
    }

    func completeAppleSignIn(_ result: Result<ASAuthorization, Error>) async throws {
        let authorization = try result.get()
        guard
            let appleCredential = authorization.credential as? ASAuthorizationAppleIDCredential,
            let nonce = currentAppleNonce,
            let tokenData = appleCredential.identityToken,
            let idToken = String(data: tokenData, encoding: .utf8)
        else {
            throw AuthSessionError.missingAppleToken
        }

        let credential = OAuthProvider.appleCredential(
            withIDToken: idToken,
            rawNonce: nonce,
            fullName: appleCredential.fullName
        )
        let authResult = try await Auth.auth().signIn(with: credential)

        // Apple shares the user's name only on the very first sign-in.
        if authResult.user.displayName == nil, let fullName = appleCredential.fullName {
            try await updateDisplayName(PersonNameComponentsFormatter().string(from: fullName), for: authResult.user)
        }
    }

    // MARK: Sign out

    func signOut() throws {
        try Auth.auth().signOut()
        GIDSignIn.sharedInstance.signOut()
        Task { await NotificationScheduler.shared.removeAll() }
    }

    private func updateDisplayName(_ name: String, for user: User) async throws {
        let trimmed = name.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !trimmed.isEmpty else { return }

        let change = user.createProfileChangeRequest()
        change.displayName = trimmed
        try await change.commitChanges()
        state = .signedIn(AuthUser(user))
    }

    private static func topViewController() -> UIViewController? {
        let keyWindow = UIApplication.shared.connectedScenes
            .compactMap { $0 as? UIWindowScene }
            .flatMap(\.windows)
            .first(where: \.isKeyWindow)
        var controller = keyWindow?.rootViewController
        while let presented = controller?.presentedViewController {
            controller = presented
        }
        return controller
    }
}
