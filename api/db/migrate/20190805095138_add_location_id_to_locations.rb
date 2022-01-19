class AddLocationIdToLocations < ActiveRecord::Migration[7.0]
  def change
    add_column :locations, :location_id, :string
  end
end
