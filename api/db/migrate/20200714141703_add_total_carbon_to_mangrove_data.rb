class AddTotalCarbonToMangroveData < ActiveRecord::Migration[7.0]
  def change
    add_column :mangrove_data, :total_carbon, :json
  end
end
