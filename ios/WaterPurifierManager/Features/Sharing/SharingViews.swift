import SwiftUI

extension MemberRole {
    var title: LocalizedStringKey {
        switch self {
        case .editor: "Editor"
        case .viewer: "Viewer"
        }
    }

    var summary: LocalizedStringKey {
        switch self {
        case .editor: "Can edit details and replace filters"
        case .viewer: "Can only view"
        }
    }
}

extension AccessRole {
    var title: LocalizedStringKey {
        switch self {
        case .owner: "Owner"
        case .member(let role): role.title
        }
    }
}

extension Invite.Problem {
    var message: String {
        switch self {
        case .expired: String(localized: "This invite has expired. Ask the owner for a new one.")
        case .used: String(localized: "This invite has already been used.")
        case .declined: String(localized: "This invite was declined.")
        case .wrongEmail(let email): String(localized: "This invite was sent to \(email). Sign in with that email to accept it.")
        case .unverifiedEmail: String(localized: "Verify your email address before accepting this invite.")
        case .ownPurifier: String(localized: "This is your own purifier.")
        case .alreadyMember: String(localized: "You already have access to this purifier.")
        }
    }
}

/// "Shared · Editor" style label for purifiers the user doesn't own.
struct SharedBadge: View {
    let role: MemberRole

    var body: some View {
        Label {
            Text("Shared · \(Text(role.title))")
        } icon: {
            Image(systemName: "person.2.fill")
        }
        .font(.caption.weight(.medium))
        .foregroundStyle(.secondary)
    }
}

/// Email invites waiting for the user, shown on the dashboard.
struct PendingInvitesSection: View {
    @Environment(MyInvitesStore.self) private var myInvites
    @State private var busyId: String?
    @State private var errorMessage: String?

    var body: some View {
        if !myInvites.invites.isEmpty {
            Section("Invites for you") {
                ForEach(myInvites.invites) { invite in
                    VStack(alignment: .leading, spacing: 8) {
                        Text("\(invite.createdByName) invited you to \"\(invite.purifierName)\" as \(Text(invite.role.title))")
                        HStack {
                            Button("Accept") { run(invite) { try await myInvites.accept(invite) } }
                                .buttonStyle(.borderedProminent)
                            Button("Decline") { run(invite) { try await myInvites.decline(invite) } }
                                .buttonStyle(.bordered)
                            if busyId == invite.id { ProgressView() }
                        }
                        .disabled(busyId != nil)
                    }
                    .padding(.vertical, 4)
                }
            }
            .errorAlert($errorMessage)
        }
    }

    private func run(_ invite: Invite, _ action: @escaping () async throws -> Void) {
        busyId = invite.id
        Task {
            defer { busyId = nil }
            do {
                try await action()
            } catch {
                errorMessage = String(localized: "Could not accept the invite.")
            }
        }
    }
}

/// Paste an invite link (or code) received by message and join the purifier.
struct JoinInviteView: View {
    @Environment(PurifierStore.self) private var store
    @Environment(\.dismiss) private var dismiss

    @State private var text = ""
    @State private var invite: Invite?
    @State private var problem: Invite.Problem?
    @State private var isLoading = false
    @State private var isAccepting = false
    @State private var errorMessage: String?

    private let repository = SharingRepository()

    var body: some View {
        Form {
            Section {
                TextField("Invite link", text: $text, prompt: Text("https://…/invite/…"), axis: .vertical)
                    .accessibilityIdentifier("inviteLinkField")
                    .textInputAutocapitalization(.never)
                    .autocorrectionDisabled()
                    .keyboardType(.URL)
                if text.isEmpty {
                    // PasteButton reads the clipboard only when tapped, so iOS shows no paste prompt.
                    PasteButton(payloadType: String.self) { strings in
                        text = strings.first ?? ""
                    }
                }
            } footer: {
                Text("Paste the invite link you received from the purifier's owner.")
            }

            if isLoading {
                Section { ProgressView() }
            } else if let invite {
                Section {
                    LabeledContent("Purifier", value: invite.purifierName)
                    LabeledContent("Invited by", value: invite.createdByName)
                    LabeledContent("Role") { Text(invite.role.title) }
                } footer: {
                    if let problem {
                        Text(problem.message).foregroundStyle(.red)
                    } else {
                        Text(invite.role.summary)
                    }
                }

                if problem == nil {
                    Section {
                        Button {
                            accept(invite)
                        } label: {
                            HStack {
                                Spacer()
                                if isAccepting { ProgressView() } else { Text("Accept invite").bold() }
                                Spacer()
                            }
                        }
                        .disabled(isAccepting)
                    }
                }
            } else if InviteLink.inviteId(from: text) != nil {
                Section {
                    Text("This invite doesn't exist or was revoked.").foregroundStyle(.secondary)
                }
            }
        }
        .navigationTitle("Join a purifier")
        .navigationBarTitleDisplayMode(.inline)
        .toolbar {
            ToolbarItem(placement: .cancellationAction) {
                Button("Cancel") { dismiss() }
            }
        }
        .task(id: text) { await lookUp() }
        .errorAlert($errorMessage)
    }

    private func lookUp() async {
        invite = nil
        problem = nil
        guard let id = InviteLink.inviteId(from: text) else { return }
        isLoading = true
        defer { isLoading = false }

        guard let found = try? await repository.invite(id: id) else { return }
        // Readable only once the user already has access.
        let alreadyMember = await repository.purifierIfAccessible(id: found.purifierId)
            .flatMap { $0.accessRole(for: store.userId) }
            .map { $0 != .owner } ?? false
        invite = found
        problem = alreadyMember ? .alreadyMember : found.problem(for: store.user)
    }

    private func accept(_ invite: Invite) {
        isAccepting = true
        Task {
            defer { isAccepting = false }
            do {
                try await repository.accept(invite, member: store.user)
                dismiss()
            } catch {
                errorMessage = String(localized: "Could not accept the invite.")
            }
        }
    }
}

/// The owner's sharing screen for one purifier.
struct ShareView: View {
    let purifierId: String

    @Environment(PurifierStore.self) private var store
    @Environment(\.dismiss) private var dismiss

    @State private var model: PurifierSharingModel?
    @State private var role: MemberRole = .editor
    @State private var email = ""
    @State private var isCreating = false
    @State private var createdLink: URL?
    @State private var memberToRemove: String?
    @State private var errorMessage: String?

    private var purifier: Purifier? { store.purifier(id: purifierId) }

    private var trimmedEmail: String { email.trimmed }

    private var emailIsValid: Bool {
        trimmedEmail.isEmpty || trimmedEmail.range(of: #"^[^\s@]+@[^\s@]+\.[^\s@]+$"#, options: .regularExpression) != nil
    }

    var body: some View {
        Form {
            if let purifier {
                inviteSection(for: purifier)
                pendingSection
                membersSection(for: purifier)
            }
        }
        .navigationTitle("Share")
        .navigationBarTitleDisplayMode(.inline)
        .toolbar {
            ToolbarItem(placement: .confirmationAction) {
                Button("Done") { dismiss() }
            }
        }
        .task {
            let model = PurifierSharingModel(purifierId: purifierId, owner: store.user)
            self.model = model
            model.start()
        }
        .onDisappear { model?.stop() }
        .confirmationDialog(
            "Remove this person?",
            isPresented: Binding(get: { memberToRemove != nil }, set: { if !$0 { memberToRemove = nil } }),
            titleVisibility: .visible
        ) {
            Button("Remove", role: .destructive) {
                if let memberId = memberToRemove {
                    run { try await model?.remove(memberId: memberId) }
                }
            }
        } message: {
            Text("They will no longer see this purifier.")
        }
        .errorAlert($errorMessage)
    }

    private func inviteSection(for purifier: Purifier) -> some View {
        Section {
            TextField("Email (optional)", text: $email)
                .textContentType(.emailAddress)
                .keyboardType(.emailAddress)
                .textInputAutocapitalization(.never)
                .autocorrectionDisabled()
            Picker("Role", selection: $role) {
                ForEach(MemberRole.allCases) { role in
                    Text(role.title).tag(role)
                }
            }
            Button {
                createInvite(for: purifier)
            } label: {
                HStack {
                    Label("Create invite link", systemImage: "link")
                    if isCreating {
                        Spacer()
                        ProgressView()
                    }
                }
            }
            .disabled(isCreating || !emailIsValid)

            if let createdLink {
                ShareLink(item: createdLink) {
                    Label("Send invite link", systemImage: "square.and.arrow.up")
                }
                Button {
                    UIPasteboard.general.url = createdLink
                } label: {
                    Label("Copy link", systemImage: "doc.on.doc")
                }
            }
        } header: {
            Text("Invite someone")
        } footer: {
            Text("\(Text(role.summary)). With an email, only that person can use the invite. Without one, anyone with the link can. Invites expire after 7 days.")
        }
    }

    @ViewBuilder
    private var pendingSection: some View {
        if let invites = model?.invites, !invites.isEmpty {
            Section("Pending invites") {
                ForEach(invites) { invite in
                    VStack(alignment: .leading, spacing: 2) {
                        if let inviteEmail = invite.email {
                            Label(inviteEmail, systemImage: "envelope")
                        } else {
                            Label("Anyone with the link", systemImage: "link")
                        }
                        Text("\(Text(invite.role.title)) · Expires \(invite.expiresAt.formatted(date: .abbreviated, time: .omitted))")
                            .font(.caption)
                            .foregroundStyle(.secondary)
                    }
                    .swipeActions {
                        Button("Revoke", role: .destructive) {
                            run { try await model?.revoke(invite) }
                        }
                    }
                    .contextMenu {
                        if let id = invite.id {
                            ShareLink(item: InviteLink.url(for: id)) {
                                Label("Send invite link", systemImage: "square.and.arrow.up")
                            }
                        }
                        Button("Revoke", systemImage: "trash", role: .destructive) {
                            run { try await model?.revoke(invite) }
                        }
                    }
                }
            }
        }
    }

    private func membersSection(for purifier: Purifier) -> some View {
        Section("People with access") {
            LabeledContent {
                Text("Owner")
            } label: {
                VStack(alignment: .leading) {
                    Text("\(store.user.actor.name) (you)")
                    if store.user.displayName != nil, let ownEmail = store.user.email {
                        Text(ownEmail).font(.caption).foregroundStyle(.secondary)
                    }
                }
            }

            ForEach(purifier.memberIds ?? [], id: \.self) { memberId in
                let profile = purifier.memberProfiles?[memberId]
                Picker(selection: Binding(
                    get: { purifier.roles?[memberId].flatMap(MemberRole.init(rawValue:)) ?? .viewer },
                    set: { newRole in run { try await model?.changeRole(of: memberId, to: newRole) } }
                )) {
                    ForEach(MemberRole.allCases) { role in
                        Text(role.title).tag(role)
                    }
                } label: {
                    VStack(alignment: .leading) {
                        Text(profile?.name ?? profile?.email ?? memberId)
                        if profile?.name != nil, let memberEmail = profile?.email {
                            Text(memberEmail).font(.caption).foregroundStyle(.secondary)
                        }
                    }
                }
                .swipeActions {
                    Button("Remove", role: .destructive) { memberToRemove = memberId }
                }
            }
        }
    }

    private func createInvite(for purifier: Purifier) {
        isCreating = true
        Task {
            defer { isCreating = false }
            do {
                createdLink = try await model?.createInvite(for: purifier, role: role, email: trimmedEmail.isEmpty ? nil : trimmedEmail)
                email = ""
            } catch {
                errorMessage = String(localized: "Could not create the invite.")
            }
        }
    }

    private func run(_ action: @escaping () async throws -> Void) {
        Task {
            do {
                try await action()
            } catch {
                errorMessage = String(localized: "Something went wrong. Please try again.")
            }
        }
    }
}
