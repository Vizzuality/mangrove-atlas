class CreateWidgetProtectedAreas < ActiveRecord::Migration[7.0]
  def change
    create_table :widget_protected_areas do |t|
      t.integer :year
      t.float :total_area
      t.float :protected_area

      t.timestamps

      t.references :location, foreign_key: true
    end
  end
end
