class CreateLocations < ActiveRecord::Migration[7.0]
  def change
    create_table :locations do |t|
      t.string :name
      t.string :location_type
      t.string :iso
      t.json :bounds
      t.json :geometry
      t.float :area_m2
      t.float :perimeter_m

      t.timestamps
    end
  end
end
