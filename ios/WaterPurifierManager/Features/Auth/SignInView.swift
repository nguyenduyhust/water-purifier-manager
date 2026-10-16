import AuthenticationServices
import SwiftUI

struct SignInView: View {
    @Environment(AuthSession.self) private var session
    @Environment(\.colorScheme) private var colorScheme

    @State private var email = ""
    @State private var password = ""
    @State private var isWorking = false
    @State private var errorMessage: String?

    private var canSubmit: Bool {
        !email.trimmed.isEmpty && !password.isEmpty && !isWorking
    }

    var body: some View {
        Form {
            Section {
                AppHeader()
            }
            .listRowBackground(Color.clear)

            Section {
                TextField("Email", text: $email)
                    .textContentType(.username)
                    .keyboardType(.emailAddress)
                    .textInputAutocapitalization(.never)
                    .autocorrectionDisabled()
                SecureField("Password", text: $password)
                    .textContentType(.password)
            } footer: {
                NavigationLink("Forgot password?") { ForgotPasswordView(initialEmail: email) }
                    .font(.footnote)
            }

            Section {
                Button {
                    perform { try await session.signIn(email: email.trimmed, password: password) }
                } label: {
                    HStack {
                        Spacer()
                        if isWorking { ProgressView() } else { Text("Sign in").bold() }
                        Spacer()
                    }
                }
                .disabled(!canSubmit)
            }

            Section("Or continue with") {
                SignInWithAppleButton(.signIn) { request in
                    session.prepareAppleRequest(request)
                } onCompletion: { result in
                    perform { try await session.completeAppleSignIn(result) }
                }
                .signInWithAppleButtonStyle(colorScheme == .dark ? .white : .black)
                .frame(height: 44)
                .listRowInsets(EdgeInsets())

                Button {
                    perform { try await session.signInWithGoogle() }
                } label: {
                    Label("Continue with Google", systemImage: "globe")
                        .frame(maxWidth: .infinity)
                }
            }
            .disabled(isWorking)

            Section {
                NavigationLink("Don't have an account? Sign up") { SignUpView() }
            }
        }
        .navigationTitle("Sign in")
        .errorAlert($errorMessage)
    }

    private func perform(_ action: @escaping () async throws -> Void) {
        isWorking = true
        Task {
            defer { isWorking = false }
            do {
                try await action()
            } catch {
                errorMessage = AuthErrorMessage.message(for: error)
            }
        }
    }
}

struct AppHeader: View {
    var body: some View {
        VStack(spacing: 8) {
            Image(systemName: "drop.fill")
                .font(.system(size: 44))
                .foregroundStyle(.tint)
            Text("Water Purifier Manager")
                .font(.title2.bold())
            Text("Track filter replacements for your water purifiers")
                .font(.subheadline)
                .foregroundStyle(.secondary)
                .multilineTextAlignment(.center)
        }
        .frame(maxWidth: .infinity)
    }
}
