class CreateKlachten < ActiveRecord::Migration[8.0]
  def change
    create_table :klachten do |t|
      t.float :longitude, null: false
      t.float :latitude, null: false
      t.string :title, null: false
      t.text :description, null: false

      t.timestamps
    end
  end
end
