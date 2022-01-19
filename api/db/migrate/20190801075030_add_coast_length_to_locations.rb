class AddCoastLengthToLocations < ActiveRecord::Migration[7.0]
  def change
    add_column :locations, :coast_length_m, :float
  end
end
