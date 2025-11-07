class AddEmailToKlachts < ActiveRecord::Migration[8.0]
  def change
    add_column :klachts, :email, :string
    add_index :klachts, :email
  end
end
