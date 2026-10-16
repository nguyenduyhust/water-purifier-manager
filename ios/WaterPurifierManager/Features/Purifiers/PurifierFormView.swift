import SwiftUI

struct PurifierFormView: View {
    enum Mode {
        case create
        case edit(Purifier)
    }

    private static let maxNameLength = 100
    private static let maxLocationLength = 200
    private static let maxNotesLength = 500

    let mode: Mode

    @Environment(PurifierStore.self) private var store
    @Environment(\.dismiss) private var dismiss

    @State private var name: String
    @State private var typeId: String
    @State private var location: String
    @State private var installationDate: Date
    @State private var notes: String
    @State private var isSaving = false
    @State private var errorMessage: String?

    private let catalog = PurifierTypeCatalog.shared

    init(mode: Mode) {
        self.mode = mode
        switch mode {
        case .create:
            _name = State(initialValue: "")
            _typeId = State(initialValue: "")
            _location = State(initialValue: "")
            _installationDate = State(initialValue: .now)
            _notes = State(initialValue: "")
        case .edit(let purifier):
            _name = State(initialValue: purifier.name)
            _typeId = State(initialValue: purifier.typeId)
            _location = State(initialValue: purifier.location ?? "")
            _installationDate = State(initialValue: purifier.installationDate)
            _notes = State(initialValue: purifier.notes ?? "")
        }
    }

    private var isCreating: Bool {
        if case .create = mode { return true }
        return false
    }

    private var selectedType: PurifierType? { catalog.type(id: typeId) }

    private var isValid: Bool {
        !name.trimmed.isEmpty
            && name.count <= Self.maxNameLength
            && location.count <= Self.maxLocationLength
            && notes.count <= Self.maxNotesLength
            && (!isCreating || selectedType != nil)
    }

    var body: some View {
        Form {
            Section {
                TextField("Name", text: $name, prompt: Text("e.g. Kitchen purifier"))
                TextField("Location", text: $location, prompt: Text("e.g. Kitchen, Living room"))
            }

            if isCreating {
                Section {
                    Picker("Purifier type", selection: $typeId) {
                        Text("Select a purifier type").tag("")
                        ForEach(catalog.typesByBrand, id: \.brand) { group in
                            Section(group.brand) {
                                ForEach(group.types) { type in
                                    Text(type.name.resolved()).tag(type.id)
                                }
                            }
                        }
                    }
                    .pickerStyle(.navigationLink)

                    DatePicker("Installation date", selection: $installationDate, in: ...Date.now, displayedComponents: .date)
                } footer: {
                    Text("Filter replacement dates are calculated from the installation date.")
                }

                if let selectedType {
                    Section("Filters") {
                        ForEach(selectedType.filterTemplates, id: \.position) { template in
                            VStack(alignment: .leading, spacing: 2) {
                                Text(template.name.resolved())
                                Text(FilterText.interval(months: template.defaultIntervalMonths))
                                    .font(.footnote)
                                    .foregroundStyle(.secondary)
                            }
                        }
                    }
                }
            }

            Section("Notes") {
                TextField("Notes", text: $notes, prompt: Text("Additional notes about this purifier…"), axis: .vertical)
                    .lineLimit(3...6)
            }
        }
        .navigationTitle(isCreating ? "New purifier" : "Edit purifier")
        .navigationBarTitleDisplayMode(.inline)
        .toolbar {
            ToolbarItem(placement: .cancellationAction) {
                Button("Cancel") { dismiss() }
            }
            ToolbarItem(placement: .confirmationAction) {
                if isSaving {
                    ProgressView()
                } else {
                    Button("Save") { save() }
                        .disabled(!isValid)
                }
            }
        }
        .interactiveDismissDisabled(isSaving)
        .errorAlert($errorMessage)
    }

    private func save() {
        isSaving = true
        Task {
            defer { isSaving = false }
            do {
                switch mode {
                case .create:
                    guard let selectedType else { return }
                    try await store.create(NewPurifier(
                        type: selectedType,
                        name: name.trimmed,
                        location: location.trimmed,
                        installationDate: installationDate,
                        notes: notes.trimmed
                    ))
                case .edit(let purifier):
                    guard let id = purifier.id else { return }
                    try await store.update(purifierId: id, name: name.trimmed, location: location.trimmed, notes: notes.trimmed)
                }
                dismiss()
            } catch {
                errorMessage = isCreating
                    ? String(localized: "Failed to add purifier. Please try again.")
                    : String(localized: "Failed to update purifier. Please try again.")
            }
        }
    }
}
