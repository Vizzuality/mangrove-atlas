namespace :net_change do
  desc "Create worlwide location"

  task :populate => [:environment] do
    mangrove_datum = MangroveDatum.all

    mangrove_datum.each do |m|
      m.update(net_change_m2: m.gain_m2.to_f - m.loss_m2.to_f)
    end

    puts "All data has been updated"
  end
end
