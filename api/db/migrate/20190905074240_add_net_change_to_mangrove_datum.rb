class AddNetChangeToMangroveDatum < ActiveRecord::Migration[7.0]
  def change
    add_column :mangrove_data, :net_change_m2, :float
  end
end
