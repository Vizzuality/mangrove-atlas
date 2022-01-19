class AddTotalCarbonColumnsToMangroveData < ActiveRecord::Migration[7.0]
  def change
    add_column :mangrove_data, :agb_tco2e, :float
    add_column :mangrove_data, :bgb_tco2e, :float
    add_column :mangrove_data, :soc_tco2e, :float
    add_column :mangrove_data, :toc_tco2e, :float
    add_column :mangrove_data, :toc_hist_tco2eha, :json
  end
end
