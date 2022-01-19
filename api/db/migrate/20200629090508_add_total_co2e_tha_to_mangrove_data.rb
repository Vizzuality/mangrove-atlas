class AddTotalCo2eThaToMangroveData < ActiveRecord::Migration[7.0]
  def change
    add_column :mangrove_data, :total_co2e_tha, :float
  end
end
