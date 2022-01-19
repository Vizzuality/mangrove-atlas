class CreateMangroveData < ActiveRecord::Migration[7.0]
  def change
    create_table :mangrove_data do |t|
      t.date :date
      t.float :gain_m2
      t.float :loss_m2
      t.float :length_m
      t.float :area_m2
      t.float :hmax_m
      t.float :agb_mgha_1
      t.float :hba_m

      t.references :location, foreign_key: true

      t.timestamps
    end
  end
end
