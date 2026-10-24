import SwiftUI

struct SignUpView: View {
    @Environment(AuthSession.self) private var session

    @State private var name = ""
    @State private var email = ""
    @State private var password = ""
    @State private var confirmPassword = ""
    @State private var isWorking = false
    @State private var errorMessage: String?

    private var passwordsMatch: Bool { password == confirmPassword }

    /// iOS's strong password suggestion takes over the fields in UI tests, which can't dismiss it;
    /// a one-time-code field never gets one.
    private var newPasswordContentType: UITextContentType? {
        #if DEBUG
        if ProcessInfo.processInfo.arguments.contains("-useFirebaseEmulators") { return .oneTimeCode }
        #endif
        return .newPassword
    }

    private var canSubmit: Bool {
        !email.trimmed.isEmpty && password.count >= 6 && passwordsMatch && !isWorking
    }

    var body: some View {
        Form {
            Section {
                TextField("Name", text: $name)
                    .textContentType(.name)
                TextField("Email", text: $email)
                    .textContentType(.username)
                    .keyboardType(.emailAddress)
                    .textInputAutocapitalization(.never)
                    .autocorrectionDisabled()
            }

            Section {
                SecureField("Password", text: $password)
                    .textContentType(newPasswordContentType)
                SecureField("Confirm password", text: $confirmPassword)
                    .textContentType(newPasswordContentType)
            } footer: {
                if !confirmPassword.isEmpty && !passwordsMatch {
                    Text("Passwords don't match")
                        .foregroundStyle(.red)
                } else {
                    Text("At least 6 characters")
                }
            }

            Section {
                Button {
                    signUp()
                } label: {
                    HStack {
                        Spacer()
                        if isWorking { ProgressView() } else { Text("Create account").bold() }
                        Spacer()
                    }
                }
                .disabled(!canSubmit)
            }
        }
        .navigationTitle("Sign up")
        .errorAlert($errorMessage)
    }

    private func signUp() {
        isWorking = true
        Task {
            defer { isWorking = false }
            do {
                try await session.signUp(name: name, email: email.trimmed, password: password)
            } catch {
                errorMessage = AuthErrorMessage.message(for: error)
            }
        }
    }
}
