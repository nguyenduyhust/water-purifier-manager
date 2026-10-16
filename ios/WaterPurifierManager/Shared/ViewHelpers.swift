import SwiftUI

struct PurifierRoute: Hashable {
    let id: String
}

extension View {
    /// Shows `message` in an alert and clears it when dismissed.
    func errorAlert(_ message: Binding<String?>) -> some View {
        alert(
            "Error",
            isPresented: Binding(
                get: { message.wrappedValue != nil },
                set: { if !$0 { message.wrappedValue = nil } }
            ),
            presenting: message.wrappedValue
        ) { _ in
            Button("OK", role: .cancel) {}
        } message: { text in
            Text(text)
        }
    }

    func purifierDestination() -> some View {
        navigationDestination(for: PurifierRoute.self) { route in
            PurifierDetailView(purifierId: route.id)
        }
    }
}

extension String {
    var trimmed: String { trimmingCharacters(in: .whitespacesAndNewlines) }
}
