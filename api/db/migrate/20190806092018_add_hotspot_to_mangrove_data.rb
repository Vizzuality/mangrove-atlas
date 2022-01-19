class AddHotspotToMangroveData < ActiveRecord::Migration[7.0]
  def change
    add_column :mangrove_data, :con_hotspot_summary_km2, :string
  end
end
