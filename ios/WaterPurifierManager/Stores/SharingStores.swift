import FirebaseFirestore
import Foundation
import Observation

/// Pending email invites addressed to the signed-in user.
@MainActor
@Observable
final class MyInvitesStore {
    private(set) var invites: [Invite] = []

    @ObservationIgnored private let repository = SharingRepository()
    @ObservationIgnored private var listener: ListenerRegistration?
    let user: AuthUser

    init(user: AuthUser) {
        self.user = user
    }

    func start() {
        // Only a verified email can accept, so unverified accounts see nothing.
        guard listener == nil, user.isEmailVerified, let email = user.email else { return }
        listener = repository.listenToMyInvites(email: email) { [weak self] invites in
            MainActor.assumeIsolated { self?.invites = invites }
        }
    }

    func stop() {
        listener?.remove()
        listener = nil
    }

    func accept(_ invite: Invite) async throws {
        try await repository.accept(invite, member: user)
    }

    func decline(_ invite: Invite) async throws {
        guard let id = invite.id else { return }
        try await repository.decline(id)
    }
}

/// The owner's view of one purifier's sharing: pending invites and member actions.
@MainActor
@Observable
final class PurifierSharingModel {
    private(set) var invites: [Invite] = []

    @ObservationIgnored private let repository = SharingRepository()
    @ObservationIgnored private var listener: ListenerRegistration?
    let purifierId: String
    let owner: AuthUser

    init(purifierId: String, owner: AuthUser) {
        self.purifierId = purifierId
        self.owner = owner
    }

    func start() {
        guard listener == nil else { return }
        listener = repository.listenToPurifierInvites(purifierId: purifierId, ownerId: owner.uid) { [weak self] invites in
            MainActor.assumeIsolated { self?.invites = invites }
        }
    }

    func stop() {
        listener?.remove()
        listener = nil
    }

    func createInvite(for purifier: Purifier, role: MemberRole, email: String?) async throws -> URL {
        let id = try await repository.createInvite(for: purifier, role: role, email: email, owner: owner.actor)
        return InviteLink.url(for: id)
    }

    func revoke(_ invite: Invite) async throws {
        guard let id = invite.id else { return }
        try await repository.revokeInvite(id)
    }

    func changeRole(of memberId: String, to role: MemberRole) async throws {
        try await repository.changeRole(purifierId: purifierId, memberId: memberId, role: role)
    }

    func remove(memberId: String) async throws {
        try await repository.removeMember(purifierId: purifierId, memberId: memberId)
    }
}
