import SwiftUI

struct ReplaceFilterSheet: View {
    let item: FilterItem

    @Environment(PurifierStore.self) private var store
    @Environment(\.dismiss) private var dismiss

    @State private var replacedAt = Date.now
    @State private var notes = ""
    @State private var isSaving = false
    @State private var errorMessage: String?

    var body: some View {
        Form {
            Section {
                LabeledContent("Filter", value: item.filter.name)
                LabeledContent("Purifier", value: item.purifier.name)
            }

            Section {
                DatePicker("Replacement date", selection: $replacedAt, in: ...Date.now, displayedComponents: .date)
                TextField("Notes (optional)", text: $notes, prompt: Text("e.g. Replaced with a genuine filter"), axis: .vertical)
                    .lineLimit(2...4)
            }
        }
        .navigationTitle("Replace filter")
        .navigationBarTitleDisplayMode(.inline)
        .toolbar {
            ToolbarItem(placement: .cancellationAction) {
                Button("Cancel") { dismiss() }
            }
            ToolbarItem(placement: .confirmationAction) {
                if isSaving {
                    ProgressView()
                } else {
                    Button("Replace") { replace() }
                }
            }
        }
        .interactiveDismissDisabled(isSaving)
        .errorAlert($errorMessage)
    }

    private func replace() {
        isSaving = true
        Task {
            defer { isSaving = false }
            do {
                try await store.replaceFilter(item, replacedAt: replacedAt, notes: notes)
                dismiss()
            } catch {
                errorMessage = String(localized: "Failed to replace filter. Please try again.")
            }
        }
    }
}
