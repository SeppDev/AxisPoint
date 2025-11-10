class AddStatusToKlachts < ActiveRecord::Migration[8.0]
  def change
    add_column :klachts, :status, :string, null: false, default: "open"
    add_index :klachts, :status
  end
end
