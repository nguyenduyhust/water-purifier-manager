import FirebaseFirestore
import Foundation

/// Invites and membership, matching `web/src/services/sharing-service.ts`.
/// The security rules in firebase/firestore.rules enforce who may do what.
struct SharingRepository {
    private var db: Firestore { Firestore.firestore() }
    private var invites: CollectionReference { db.collection("invites") }

    private func purifier(_ id: String) -> DocumentReference {
        db.collection("purifiers").document(id)
    }

    func createInvite(for purifier: Purifier, role: MemberRole, email: String?, owner: Actor) async throws -> String {
        guard let purifierId = purifier.id else { throw CocoaError(.coderValueNotFound) }

        // Members have no other way to see who owns the purifier.
        if purifier.ownerName != owner.name {
            try await self.purifier(purifierId).updateData(["ownerName": owner.name])
        }

        let normalizedEmail = email?.trimmingCharacters(in: .whitespacesAndNewlines).lowercased()
        let ref = invites.document()
        try await ref.setData([
            "purifierId": purifierId,
            "purifierName": purifier.name,
            "role": role.rawValue,
            "email": normalizedEmail?.isEmpty == false ? normalizedEmail! : NSNull(),
            "status": "pending",
            "createdBy": owner.id,
            "createdByName": owner.name,
            "createdAt": Timestamp(date: .now),
            "expiresAt": Timestamp(date: .now.addingTimeInterval(InviteLink.validity)),
        ])
        return ref.documentID
    }

    func revokeInvite(_ inviteId: String) async throws {
        try await invites.document(inviteId).delete()
    }

    /// Pending invites the owner created for a purifier.
    func listenToPurifierInvites(
        purifierId: String,
        ownerId: String,
        onChange: @escaping ([Invite]) -> Void
    ) -> ListenerRegistration {
        invites
            .whereField("createdBy", isEqualTo: ownerId)
            .whereField("purifierId", isEqualTo: purifierId)
            .whereField("status", isEqualTo: "pending")
            .addSnapshotListener { snapshot, _ in
                let found = snapshot?.documents.compactMap { try? $0.data(as: Invite.self) } ?? []
                onChange(found.sorted { $0.createdAt > $1.createdAt })
            }
    }

    /// Pending invites addressed to the signed-in user's email.
    func listenToMyInvites(email: String, onChange: @escaping ([Invite]) -> Void) -> ListenerRegistration {
        invites
            .whereField("email", isEqualTo: email.lowercased())
            .whereField("status", isEqualTo: "pending")
            .addSnapshotListener { snapshot, _ in
                let now = Date.now
                let found = snapshot?.documents
                    .compactMap { try? $0.data(as: Invite.self) }
                    .filter { $0.expiresAt > now } ?? []
                onChange(found.sorted { $0.createdAt > $1.createdAt })
            }
    }

    func invite(id: String) async throws -> Invite? {
        let snapshot = try await invites.document(id).getDocument()
        return snapshot.exists ? try snapshot.data(as: Invite.self) : nil
    }

    /// Readable only once the user has access, so a failure means "not a member yet".
    func purifierIfAccessible(id: String) async -> Purifier? {
        try? await purifier(id).getDocument(as: Purifier.self)
    }

    /// Joins the purifier and marks the invite used in one batch; the security
    /// rules check each write against the other.
    func accept(_ invite: Invite, member: AuthUser) async throws {
        guard let inviteId = invite.id else { return }
        let batch = db.batch()
        batch.updateData([
            "memberIds": FieldValue.arrayUnion([member.uid]),
            "roles.\(member.uid)": invite.role.rawValue,
            "memberProfiles.\(member.uid)": [
                "name": member.actor.name,
                "email": member.email ?? NSNull(),
                "joinedAt": Timestamp(date: .now),
            ] as [String: Any],
            "lastInviteId": inviteId,
        ], forDocument: purifier(invite.purifierId))
        batch.updateData([
            "status": "accepted",
            "acceptedBy": member.uid,
            "acceptedAt": FieldValue.serverTimestamp(),
        ], forDocument: invites.document(inviteId))
        try await batch.commit()
    }

    func decline(_ inviteId: String) async throws {
        try await invites.document(inviteId).updateData(["status": "declined"])
    }

    func changeRole(purifierId: String, memberId: String, role: MemberRole) async throws {
        try await purifier(purifierId).updateData(["roles.\(memberId)": role.rawValue])
    }

    /// An owner removing a member, or a member leaving.
    func removeMember(purifierId: String, memberId: String) async throws {
        try await purifier(purifierId).updateData([
            "memberIds": FieldValue.arrayRemove([memberId]),
            "roles.\(memberId)": FieldValue.delete(),
            "memberProfiles.\(memberId)": FieldValue.delete(),
        ])
    }
}
