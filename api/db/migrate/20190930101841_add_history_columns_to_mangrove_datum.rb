class AddHistoryColumnsToMangroveDatum < ActiveRecord::Migration[7.0]
  def change
    add_column :mangrove_data, :agb_hist_mgha_1, :text
    add_column :mangrove_data, :hba_hist_m, :text
    add_column :mangrove_data, :hmax_hist_m, :text
  end
end
