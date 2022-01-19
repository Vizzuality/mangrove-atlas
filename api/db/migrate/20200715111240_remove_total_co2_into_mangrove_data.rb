class RemoveTotalCo2IntoMangroveData < ActiveRecord::Migration[7.0]
  def change
    remove_column :mangrove_data, :total_co2e_tha, :float
  end
end
