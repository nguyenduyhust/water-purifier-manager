import SwiftUI

struct ForgotPasswordView: View {
    @Environment(AuthSession.self) private var session
    @Environment(\.dismiss) private var dismiss

    @State private var email: String
    @State private var isWorking = false
    @State private var sentTo: String?
    @State private var errorMessage: String?

    init(initialEmail: String = "") {
        _email = State(initialValue: initialEmail)
    }

    var body: some View {
        Form {
            if let sentTo {
                Section {
                    Label {
                        VStack(alignment: .leading, spacing: 4) {
                            Text("Check your email")
                                .font(.headline)
                            Text("We sent a password reset link to \(sentTo)")
                                .foregroundStyle(.secondary)
                        }
                    } icon: {
                        Image(systemName: "envelope.badge")
                    }
                }
                Section {
                    Button("Back to sign in") { dismiss() }
                }
            } else {
                Section {
                    TextField("Email", text: $email)
                        .textContentType(.username)
                        .keyboardType(.emailAddress)
                        .textInputAutocapitalization(.never)
                        .autocorrectionDisabled()
                } footer: {
                    Text("Enter your email and we'll send you a link to reset your password.")
                }

                Section {
                    Button {
                        sendLink()
                    } label: {
                        HStack {
                            Spacer()
                            if isWorking { ProgressView() } else { Text("Send reset link").bold() }
                            Spacer()
                        }
                    }
                    .disabled(email.trimmed.isEmpty || isWorking)
                }
            }
        }
        .navigationTitle("Reset password")
        .errorAlert($errorMessage)
    }

    private func sendLink() {
        let address = email.trimmed
        isWorking = true
        Task {
            defer { isWorking = false }
            do {
                try await session.sendPasswordReset(email: address)
                sentTo = address
            } catch {
                errorMessage = AuthErrorMessage.message(for: error)
            }
        }
    }
}
