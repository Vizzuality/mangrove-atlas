class CreateSpecies < ActiveRecord::Migration[7.0]
  def change
    create_table :species do |t|
      t.float :value

      t.timestamps
    end
  end
end
