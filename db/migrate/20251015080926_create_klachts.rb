class CreateKlachts < ActiveRecord::Migration[8.0]
  def change
    create_table :klachts do |t|
      t.string :name
      t.text :description
      t.float :latitude
      t.float :longitude

      t.timestamps
    end
  end
end
