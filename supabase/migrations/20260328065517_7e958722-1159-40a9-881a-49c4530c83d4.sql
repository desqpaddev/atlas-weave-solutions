-- Insert Tours
INSERT INTO public.tours (company_id, title, slug, destination, duration_days, duration_nights, adult_price, child_price, group_price, category, difficulty, max_group_size, description, cover_image, highlights, inclusions, exclusions, itinerary, is_active) VALUES
('c3aa80f7-372f-49b8-b4a2-9466a305fe53', 'Bali Wellness Retreat', 'bali-wellness-retreat', 'Bali, Indonesia', 7, 6, 1299, 899, 6999, 'Wellness', 'easy', 12,
 'Rejuvenate in Bali with curated spa rituals, sunrise yoga sessions, and immersive cultural experiences through rice terraces and ancient temples.',
 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800',
 ARRAY['Sunrise yoga at Ubud', 'Private spa therapy', 'Rice terrace trek', 'Beachside sunset dinner', 'Temple ceremony experience'],
 ARRAY['6-night luxury villa stay', 'Daily breakfast & dinner', 'Airport transfers', 'Guided excursions', 'All wellness sessions', 'Travel insurance'],
 ARRAY['International flights', 'Visa fees', 'Personal expenses', 'Lunch'],
 '[{"day":1,"title":"Arrival in Bali","description":"Airport welcome with flower garlands and private transfer to your luxury villa in Ubud.","activities":["Private airport transfer","Welcome drink & villa check-in","Evening relaxation at infinity pool"]},{"day":2,"title":"Wellness & Relaxation","description":"Begin your wellness journey with expert-led sessions.","activities":["Sunrise yoga session","Balinese massage & spa","Meditation workshop","Healthy organic lunch"]},{"day":3,"title":"Ubud Cultural Discovery","description":"Explore the cultural heart of Bali.","activities":["Tegallalang rice terrace visit","Sacred monkey forest","Traditional art village tour","Local market exploration"]},{"day":4,"title":"Adventure Day","description":"Optional adventure activities in lush Bali landscapes.","activities":["White water rafting","Waterfall trek","Coffee plantation visit","Sunset temple ceremony"]},{"day":5,"title":"Beach & Ocean","description":"Transfer to southern Bali for beach experiences.","activities":["Beach club day","Snorkeling excursion","Seafood beach dinner"]},{"day":6,"title":"Spiritual Journey","description":"Deep dive into Balinese spirituality.","activities":["Water purification ceremony","Yoga & sound healing","Farewell gala dinner"]},{"day":7,"title":"Departure","description":"Leisurely morning before airport transfer.","activities":["Breakfast at villa","Souvenir shopping","Airport transfer"]}]'::jsonb, true),

('c3aa80f7-372f-49b8-b4a2-9466a305fe53', 'Swiss Alpine Adventure', 'swiss-alpine-adventure', 'Swiss Alps, Switzerland', 5, 4, 2199, 1599, 10999, 'Adventure', 'moderate', 10,
 'A breathtaking alpine journey through iconic Swiss peaks, scenic mountain trains, and adrenaline-pumping activities amid stunning natural beauty.',
 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800',
 ARRAY['Jungfraujoch glacier viewpoint', 'Scenic rail through Alps', 'Paragliding over Interlaken', 'Lakeside village walks', 'Swiss chocolate tasting'],
 ARRAY['4-night mountain lodge stay', 'Daily breakfast', 'Swiss travel pass', 'Guided mountain experience', 'Cable car tickets'],
 ARRAY['International flights', 'Visa fees', 'Travel insurance', 'Lunch and dinners', 'Personal equipment'],
 '[{"day":1,"title":"Arrival & Orientation","description":"Settle into your cozy alpine lodge in Interlaken.","activities":["Train from Zurich to Interlaken","Lodge check-in","Town orientation walk","Welcome fondue dinner"]},{"day":2,"title":"Jungfraujoch Experience","description":"Visit the Top of Europe at 3,454m altitude.","activities":["Cogwheel train to Jungfraujoch","Ice palace visit","Glacier viewpoint","Alpine photography session"]},{"day":3,"title":"Adventure Day","description":"Choose your thrill in the Swiss Alps.","activities":["Optional paragliding","Mountain bike trails","Lake Brienz cruise","Swiss chocolate workshop"]},{"day":4,"title":"Scenic Rail & Villages","description":"Ride the famous GoldenPass panoramic train.","activities":["GoldenPass scenic train","Gruyères village visit","Cheese factory tour","Farewell dinner"]},{"day":5,"title":"Departure","description":"Morning at leisure before transfer.","activities":["Breakfast with mountain views","Souvenir shopping","Transfer to Zurich airport"]}]'::jsonb, true),

('c3aa80f7-372f-49b8-b4a2-9466a305fe53', 'Dubai Gold Experience', 'dubai-gold-experience', 'Dubai, UAE', 4, 3, 1599, 1099, 7999, 'City', 'easy', 15,
 'Experience Dubai''s dazzling luxury lifestyle with iconic skyline views, thrilling desert adventures, and world-class shopping.',
 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800',
 ARRAY['Burj Khalifa observation deck', 'Desert safari & BBQ', 'Dubai Marina yacht cruise', 'Gold Souk exploration', 'Atlantis waterpark access'],
 ARRAY['3-night 5-star hotel stay', 'Daily breakfast', 'Airport transfers', 'Desert safari with BBQ dinner', 'City tour'],
 ARRAY['Visa fees', 'Personal shopping', 'Travel insurance', 'Optional activities'],
 '[{"day":1,"title":"Welcome to Dubai","description":"Arrive in the city of gold and settle into luxury.","activities":["Private airport transfer","5-star hotel check-in","Evening Dubai Marina walk","Welcome dinner at waterfront restaurant"]},{"day":2,"title":"Iconic City Tour","description":"Discover Dubai''s most famous landmarks.","activities":["Burj Khalifa observation deck","Dubai Mall & aquarium","Old Dubai & Gold Souk","Dubai Fountain show"]},{"day":3,"title":"Desert & Entertainment","description":"Adventure in the golden dunes.","activities":["Morning at Atlantis waterpark","Afternoon desert safari","Dune bashing & camel ride","BBQ dinner with live entertainment"]},{"day":4,"title":"Departure","description":"Last-minute shopping and departure.","activities":["Breakfast at hotel","Duty-free shopping","Airport transfer"]}]'::jsonb, true),

('c3aa80f7-372f-49b8-b4a2-9466a305fe53', 'Maldives Ocean Escape', 'maldives-ocean-escape', 'Maldives', 6, 5, 2499, 1799, 12499, 'Beach', 'easy', 8,
 'A luxury island retreat with turquoise lagoons, overwater villas, and curated ocean experiences in paradise.',
 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800',
 ARRAY['Overwater villa stay', 'Coral reef snorkeling', 'Sunset dolphin cruise', 'Private island picnic', 'Underwater restaurant dinner'],
 ARRAY['5-night overwater villa', 'All meals included', 'Speedboat transfers', 'Water sports activities', 'Spa credit'],
 ARRAY['International airfare', 'Personal expenses', 'Premium excursions'],
 '[{"day":1,"title":"Island Arrival","description":"Speedboat transfer to your private island resort.","activities":["Male airport reception","Speedboat to resort","Villa check-in & orientation","Welcome cocktail at beach bar"]},{"day":2,"title":"Ocean Discovery","description":"Explore the vibrant underwater world.","activities":["Guided snorkeling at house reef","Kayaking in lagoon","Beach lunch","Sunset fishing trip"]},{"day":3,"title":"Wellness & Leisure","description":"Slow travel day in paradise.","activities":["Overwater spa session","Pool & beach relaxation","Underwater restaurant dinner"]},{"day":4,"title":"Island Adventure","description":"Explore beyond your resort.","activities":["Private island picnic","Jet ski excursion","Local island village visit","Stargazing dinner on sandbank"]},{"day":5,"title":"Dolphin & Sunset","description":"Magical marine encounters.","activities":["Dolphin watching cruise","Photography session","Farewell beach bonfire dinner"]},{"day":6,"title":"Departure","description":"Last morning in paradise.","activities":["Sunrise breakfast","Speedboat to Male","Airport transfer"]}]'::jsonb, true),

('c3aa80f7-372f-49b8-b4a2-9466a305fe53', 'Santorini Sunset Romance', 'santorini-sunset-romance', 'Santorini, Greece', 5, 4, 1499, 999, 7499, 'Romance', 'easy', 10,
 'Romantic cliffside stays, breathtaking caldera views, wine tasting, and iconic Greek island charm.',
 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800',
 ARRAY['Caldera sunset views', 'Catamaran cruise', 'Wine tasting at vineyard', 'Blue-dome photo tour', 'Private dinner with view'],
 ARRAY['4-night cliffside hotel', 'Daily breakfast', 'Port transfers', 'Sunset catamaran cruise', 'Wine tasting tour'],
 ARRAY['International flights', 'Visa fees', 'Lunch and dinners', 'Personal expenses'],
 '[{"day":1,"title":"Arrival in Santorini","description":"Welcome to the jewel of the Aegean.","activities":["Airport/port transfer","Cliffside hotel check-in","Fira town evening stroll","Welcome dinner with caldera view"]},{"day":2,"title":"Oia Discovery","description":"Explore the most photographed village in Greece.","activities":["Oia walking tour","Blue-dome church photos","Art gallery visits","Famous Oia sunset"]},{"day":3,"title":"Sea & Wine","description":"Cruise and tasting experience.","activities":["Catamaran cruise around caldera","Swimming at hot springs","Onboard lunch","Evening wine tasting at vineyard"]},{"day":4,"title":"Beach & Culture","description":"Discover Santorini''s unique beaches.","activities":["Red Beach visit","Akrotiri archaeological site","Black sand beach","Private rooftop farewell dinner"]},{"day":5,"title":"Departure","description":"Last morning on the island.","activities":["Breakfast with sea view","Souvenir shopping","Transfer to airport/port"]}]'::jsonb, true),

('c3aa80f7-372f-49b8-b4a2-9466a305fe53', 'Kyoto Cultural Journey', 'kyoto-cultural-journey', 'Kyoto, Japan', 6, 5, 1799, 1299, 8999, 'Culture', 'easy', 14,
 'A deep cultural immersion into Kyoto''s ancient temples, traditional tea ceremonies, bamboo forests, and culinary treasures.',
 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800',
 ARRAY['Fushimi Inari shrine', 'Traditional tea ceremony', 'Arashiyama bamboo grove', 'Geisha district walk', 'Kaiseki dining experience'],
 ARRAY['5-night traditional ryokan stay', 'Daily breakfast', 'Local English-speaking guide', 'Cultural activities & entry fees', 'Public transport pass'],
 ARRAY['International flights', 'Personal shopping', 'Travel insurance'],
 '[{"day":1,"title":"Arrival in Kyoto","description":"Welcome to Japan''s cultural capital.","activities":["Bullet train from Tokyo/Airport transfer","Ryokan check-in","Evening stroll in Gion district","Welcome kaiseki dinner"]},{"day":2,"title":"Temple Circuit","description":"Visit Kyoto''s most iconic heritage sites.","activities":["Kinkaku-ji Golden Pavilion","Ryoan-ji Zen rock garden","Nijo Castle tour","Traditional lunch"]},{"day":3,"title":"Arashiyama District","description":"Explore the western outskirts of Kyoto.","activities":["Bamboo grove walk","Monkey park visit","Boat ride on Hozu River","Tofu cuisine lunch"]},{"day":4,"title":"Cultural Workshop Day","description":"Hands-on traditional experiences.","activities":["Tea ceremony workshop","Kimono dressing experience","Calligraphy class","Sake tasting"]},{"day":5,"title":"Fushimi & Nara","description":"Day trip to nearby treasures.","activities":["Fushimi Inari 1000 gates","Nara deer park","Great Buddha temple","Farewell dinner"]},{"day":6,"title":"Departure","description":"Last morning in Kyoto.","activities":["Breakfast at ryokan","Nishiki market visit","Transfer to station/airport"]}]'::jsonb, true);

-- Insert Packages
INSERT INTO public.packages (company_id, title, slug, destination, duration_days, duration_nights, base_price, description, cover_image, includes_flight, includes_hotel, includes_tour, includes_transfer, highlights, inclusions, exclusions, itinerary, is_active) VALUES
('c3aa80f7-372f-49b8-b4a2-9466a305fe53', 'Bali Honeymoon Bliss', 'bali-honeymoon-bliss', 'Bali, Indonesia', 8, 7, 2499,
 'The ultimate romantic getaway in Bali — private villas, couple spa, candlelit dinners, and unforgettable sunsets.',
 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800',
 true, true, true, true,
 ARRAY['Private pool villa', 'Couple spa ritual', 'Candlelit beach dinner', 'Ubud cultural tour', 'Sunset cruise'],
 ARRAY['Round-trip flights', '7-night private villa', 'Daily breakfast & dinner', 'Airport transfers', 'Couple spa session', 'Sunset cruise'],
 ARRAY['Visa on arrival fees', 'Personal shopping', 'Travel insurance', 'Lunch'],
 '[{"day":1,"title":"Arrival & Welcome","description":"Private airport pickup and villa check-in.","activities":["Private transfer","Villa welcome with champagne","Infinity pool sunset"]},{"day":2,"title":"Romantic Spa Day","description":"Full day of couple wellness.","activities":["Couple Balinese massage","Flower bath ritual","Private dinner by the pool"]},{"day":3,"title":"Ubud Exploration","description":"Discover Bali''s cultural heart together.","activities":["Rice terrace walk","Art market visit","Sacred temple ceremony"]},{"day":4,"title":"Beach & Ocean","description":"Southern Bali beach adventures.","activities":["Private beach club","Snorkeling excursion","Seafood dinner on the sand"]},{"day":5,"title":"Adventure Together","description":"Thrilling activities for couples.","activities":["Sunrise volcano trek","Hot springs visit","Coffee plantation tour"]},{"day":6,"title":"Island Hopping","description":"Day trip to Nusa islands.","activities":["Nusa Penida boat trip","Crystal Bay swimming","Kelingking cliff viewpoint"]},{"day":7,"title":"Leisure & Farewell","description":"Last full day at your own pace.","activities":["Late morning at villa","Souvenir shopping","Candlelit farewell dinner on beach"]},{"day":8,"title":"Departure","description":"Sad goodbyes to paradise.","activities":["Breakfast at villa","Airport transfer"]}]'::jsonb, true),

('c3aa80f7-372f-49b8-b4a2-9466a305fe53', 'Europe Highlights', 'europe-highlights', 'Paris - Swiss - Rome', 12, 11, 4999,
 'The classic European circuit covering Paris, Swiss Alps, and Rome with guided tours, scenic trains, and cultural immersion.',
 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800',
 true, true, true, true,
 ARRAY['Eiffel Tower visit', 'Swiss scenic train', 'Colosseum tour', 'Vatican Museum', 'Seine river cruise'],
 ARRAY['Round-trip international flights', '11-night 4-star hotels', 'Daily breakfast', 'Inter-city trains', 'Guided city tours', 'All entry tickets'],
 ARRAY['Visa fees', 'Travel insurance', 'Lunch & dinner', 'Personal expenses'],
 '[{"day":1,"title":"Arrive in Paris","description":"Welcome to the City of Light.","activities":["Airport transfer","Hotel check-in","Evening Seine cruise"]},{"day":2,"title":"Paris Highlights","description":"Full day exploring iconic Paris.","activities":["Eiffel Tower visit","Louvre Museum","Champs-Élysées walk"]},{"day":3,"title":"Versailles Day Trip","description":"Royal palace excursion.","activities":["Palace of Versailles","Gardens tour","French cuisine lunch"]},{"day":4,"title":"Train to Switzerland","description":"Scenic journey to the Alps.","activities":["TGV to Interlaken","Hotel check-in","Evening lake walk"]},{"day":5,"title":"Swiss Alps Adventure","description":"Mountain experiences.","activities":["Jungfraujoch excursion","Ice palace","Alpine lunch"]},{"day":6,"title":"Lucerne & Lakes","description":"Swiss city and nature.","activities":["Lucerne old town","Chapel Bridge","Lake cruise"]},{"day":7,"title":"Train to Rome","description":"Cross into Italy.","activities":["Scenic train to Milan","Connection to Rome","Evening Roman walk"]},{"day":8,"title":"Ancient Rome","description":"Walk through history.","activities":["Colosseum tour","Roman Forum","Palatine Hill"]},{"day":9,"title":"Vatican City","description":"Art and spirituality.","activities":["Vatican Museum","Sistine Chapel","St. Peter''s Basilica"]},{"day":10,"title":"Florence Day Trip","description":"Renaissance art capital.","activities":["Train to Florence","Uffizi Gallery","Ponte Vecchio"]},{"day":11,"title":"Rome Leisure","description":"Last full day in Italy.","activities":["Trevi Fountain","Spanish Steps","Farewell dinner"]},{"day":12,"title":"Departure","description":"Arrivederci Roma!","activities":["Breakfast","Airport transfer"]}]'::jsonb, true),

('c3aa80f7-372f-49b8-b4a2-9466a305fe53', 'Thailand Beach & Culture', 'thailand-beach-culture', 'Bangkok - Phuket - Chiang Mai', 10, 9, 1899,
 'Experience the best of Thailand from bustling Bangkok to pristine Phuket beaches and Chiang Mai''s mountain culture.',
 'https://images.unsplash.com/photo-1528181304800-259b08848526?w=800',
 true, true, true, true,
 ARRAY['Grand Palace visit', 'Phi Phi island tour', 'Elephant sanctuary', 'Night market food tour', 'Thai cooking class'],
 ARRAY['Domestic flights', '9-night hotel stays', 'Daily breakfast', 'All transfers', 'Guided tours & entry fees'],
 ARRAY['International flights', 'Visa fees', 'Travel insurance', 'Lunch & dinners'],
 '[{"day":1,"title":"Arrive in Bangkok","description":"Welcome to the Land of Smiles.","activities":["Airport transfer","Hotel check-in","Khao San Road evening walk"]},{"day":2,"title":"Bangkok Temples","description":"Iconic temple circuit.","activities":["Grand Palace","Wat Pho","Wat Arun","River boat tour"]},{"day":3,"title":"Bangkok Markets","description":"Shopping and street food.","activities":["Chatuchak weekend market","Street food tour","Rooftop bar sunset"]},{"day":4,"title":"Fly to Phuket","description":"Beach paradise awaits.","activities":["Flight to Phuket","Beach resort check-in","Patong Beach evening"]},{"day":5,"title":"Phi Phi Islands","description":"Island hopping adventure.","activities":["Speedboat to Phi Phi","Maya Bay visit","Snorkeling","Beach BBQ lunch"]},{"day":6,"title":"Phuket Leisure","description":"Relaxation day.","activities":["Resort spa","Beach activities","Seafood dinner"]},{"day":7,"title":"Fly to Chiang Mai","description":"Head to the mountains.","activities":["Flight to Chiang Mai","Old city exploration","Night bazaar"]},{"day":8,"title":"Elephant Sanctuary","description":"Ethical animal experience.","activities":["Elephant sanctuary visit","Bamboo rafting","Thai cooking class"]},{"day":9,"title":"Temple & Nature","description":"Chiang Mai highlights.","activities":["Doi Suthep temple","Hill tribe village","Farewell dinner"]},{"day":10,"title":"Departure","description":"Last day in Thailand.","activities":["Breakfast","Airport transfer"]}]'::jsonb, true);

-- Insert Customers
INSERT INTO public.customers (company_id, full_name, email, phone, nationality, notes, tags) VALUES
('c3aa80f7-372f-49b8-b4a2-9466a305fe53', 'Rahul Sharma', 'rahul.sharma@email.com', '+91 98765 43210', 'Indian', 'Frequent traveler, prefers luxury stays', ARRAY['VIP', 'Repeat']),
('c3aa80f7-372f-49b8-b4a2-9466a305fe53', 'Emily Chen', 'emily.chen@email.com', '+1 415 555 0123', 'American', 'Interested in cultural tours', ARRAY['Culture', 'Asia']),
('c3aa80f7-372f-49b8-b4a2-9466a305fe53', 'Marco Rossi', 'marco.rossi@email.com', '+39 333 456 7890', 'Italian', 'Honeymoon planning', ARRAY['Honeymoon', 'Beach']),
('c3aa80f7-372f-49b8-b4a2-9466a305fe53', 'Aisha Khan', 'aisha.khan@email.com', '+971 50 123 4567', 'Emirati', 'Family vacation, needs child-friendly options', ARRAY['Family', 'Luxury']),
('c3aa80f7-372f-49b8-b4a2-9466a305fe53', 'James Wilson', 'james.wilson@email.com', '+44 7700 900123', 'British', 'Adventure enthusiast, solo traveler', ARRAY['Adventure', 'Solo']);

-- Insert Leads
INSERT INTO public.leads (company_id, full_name, email, phone, destination, pax, budget, source, status, notes, travel_dates) VALUES
('c3aa80f7-372f-49b8-b4a2-9466a305fe53', 'Priya Patel', 'priya.patel@email.com', '+91 87654 32109', 'Bali, Indonesia', 2, 3000, 'website', 'new', 'Interested in honeymoon package', '2026-05-15'),
('c3aa80f7-372f-49b8-b4a2-9466a305fe53', 'David Brown', 'david.brown@email.com', '+1 212 555 0456', 'Swiss Alps', 4, 10000, 'referral', 'contacted', 'Family trip, kids aged 8 and 12', '2026-06-20'),
('c3aa80f7-372f-49b8-b4a2-9466a305fe53', 'Yuki Tanaka', 'yuki.tanaka@email.com', '+81 90 1234 5678', 'Santorini, Greece', 2, 4000, 'website', 'quoted', 'Anniversary trip, wants private dinner', '2026-07-10'),
('c3aa80f7-372f-49b8-b4a2-9466a305fe53', 'Sarah Johnson', 'sarah.j@email.com', '+1 310 555 0789', 'Maldives', 2, 6000, 'instagram', 'negotiating', 'Luxury overwater villa required', '2026-08-01'),
('c3aa80f7-372f-49b8-b4a2-9466a305fe53', 'Ahmed Hassan', 'ahmed.h@email.com', '+20 100 123 4567', 'Dubai, UAE', 6, 12000, 'website', 'won', 'Group trip for company retreat', '2026-04-15'),
('c3aa80f7-372f-49b8-b4a2-9466a305fe53', 'Lisa Mueller', 'lisa.m@email.com', '+49 170 123 4567', 'Europe Multi-City', 2, 12000, 'google_ads', 'new', 'First time in Europe, wants everything', '2026-09-01'),
('c3aa80f7-372f-49b8-b4a2-9466a305fe53', 'Carlos Silva', 'carlos.s@email.com', '+55 11 99999 8888', 'Thailand', 3, 6000, 'facebook', 'contacted', 'Beach + culture combo', '2026-05-20');

-- Insert Agents
INSERT INTO public.agents (company_id, full_name, email, phone, commission_rate, is_active) VALUES
('c3aa80f7-372f-49b8-b4a2-9466a305fe53', 'Anita Desai', 'anita.desai@joannaholidays.com', '+91 98765 00001', 8.5, true),
('c3aa80f7-372f-49b8-b4a2-9466a305fe53', 'Tom Richards', 'tom.r@joannaholidays.com', '+44 7700 900456', 7.0, true),
('c3aa80f7-372f-49b8-b4a2-9466a305fe53', 'Mei Lin Wong', 'mei.lin@joannaholidays.com', '+65 9123 4567', 9.0, true);

-- Insert Tour Departures
INSERT INTO public.tour_departures (company_id, tour_id, departure_date, return_date, total_seats, booked_seats, status, notes, booking_cutoff_date) VALUES
('c3aa80f7-372f-49b8-b4a2-9466a305fe53', (SELECT id FROM tours WHERE slug='bali-wellness-retreat'), '2026-05-01', '2026-05-07', 12, 8, 'open', 'Peak season departure', '2026-04-20'),
('c3aa80f7-372f-49b8-b4a2-9466a305fe53', (SELECT id FROM tours WHERE slug='bali-wellness-retreat'), '2026-06-15', '2026-06-21', 12, 3, 'open', 'Summer departure', '2026-06-01'),
('c3aa80f7-372f-49b8-b4a2-9466a305fe53', (SELECT id FROM tours WHERE slug='swiss-alpine-adventure'), '2026-07-01', '2026-07-05', 10, 6, 'open', 'Summer Alps season', '2026-06-15'),
('c3aa80f7-372f-49b8-b4a2-9466a305fe53', (SELECT id FROM tours WHERE slug='swiss-alpine-adventure'), '2026-08-10', '2026-08-14', 10, 0, 'open', 'August departure', '2026-07-25'),
('c3aa80f7-372f-49b8-b4a2-9466a305fe53', (SELECT id FROM tours WHERE slug='dubai-gold-experience'), '2026-04-20', '2026-04-23', 15, 12, 'open', 'Almost full!', '2026-04-10'),
('c3aa80f7-372f-49b8-b4a2-9466a305fe53', (SELECT id FROM tours WHERE slug='maldives-ocean-escape'), '2026-06-01', '2026-06-06', 8, 4, 'open', 'Monsoon season deal', '2026-05-15'),
('c3aa80f7-372f-49b8-b4a2-9466a305fe53', (SELECT id FROM tours WHERE slug='santorini-sunset-romance'), '2026-07-15', '2026-07-19', 10, 7, 'open', 'Peak summer Greece', '2026-07-01'),
('c3aa80f7-372f-49b8-b4a2-9466a305fe53', (SELECT id FROM tours WHERE slug='kyoto-cultural-journey'), '2026-09-20', '2026-09-25', 14, 2, 'open', 'Autumn foliage season', '2026-09-05');

-- Insert Bookings
INSERT INTO public.bookings (company_id, title, reference_number, booking_type, destination, pax, total_amount, paid_amount, status, payment_status, check_in, check_out, description) VALUES
('c3aa80f7-372f-49b8-b4a2-9466a305fe53', 'Bali Honeymoon - Sharma', 'JH-2026-001', 'package', 'Bali, Indonesia', 2, 4998, 4998, 'confirmed', 'paid', '2026-05-01', '2026-05-08', 'Honeymoon package for Mr & Mrs Sharma'),
('c3aa80f7-372f-49b8-b4a2-9466a305fe53', 'Dubai Group Trip - Hassan', 'JH-2026-002', 'tour', 'Dubai, UAE', 6, 9594, 5000, 'confirmed', 'partial', '2026-04-20', '2026-04-23', 'Corporate retreat for Ahmed Hassan group'),
('c3aa80f7-372f-49b8-b4a2-9466a305fe53', 'Swiss Alps - Wilson Family', 'JH-2026-003', 'tour', 'Swiss Alps', 4, 7596, 3798, 'pending', 'partial', '2026-07-01', '2026-07-05', 'Family adventure trip'),
('c3aa80f7-372f-49b8-b4a2-9466a305fe53', 'Europe Highlights - Chen', 'JH-2026-004', 'package', 'Paris - Swiss - Rome', 2, 9998, 0, 'pending', 'pending', '2026-09-01', '2026-09-12', 'First Europe trip for Emily Chen'),
('c3aa80f7-372f-49b8-b4a2-9466a305fe53', 'Maldives Escape - Johnson', 'JH-2026-005', 'tour', 'Maldives', 2, 4998, 4998, 'confirmed', 'paid', '2026-06-01', '2026-06-06', 'Luxury overwater villa booking'),
('c3aa80f7-372f-49b8-b4a2-9466a305fe53', 'Santorini Romance - Rossi', 'JH-2026-006', 'tour', 'Santorini, Greece', 2, 2998, 1500, 'confirmed', 'partial', '2026-07-15', '2026-07-19', 'Anniversary trip for Marco Rossi'),
('c3aa80f7-372f-49b8-b4a2-9466a305fe53', 'Thailand Adventure - Khan Family', 'JH-2026-007', 'package', 'Bangkok - Phuket - Chiang Mai', 4, 7596, 0, 'pending', 'pending', '2026-05-20', '2026-05-29', 'Family vacation with kids');

-- Insert Payments
INSERT INTO public.payments (booking_id, amount, currency, method, status, paid_at, notes) VALUES
((SELECT id FROM bookings WHERE reference_number='JH-2026-001'), 4998, 'USD', 'credit_card', 'paid', '2026-03-15', 'Full payment received'),
((SELECT id FROM bookings WHERE reference_number='JH-2026-002'), 5000, 'USD', 'bank_transfer', 'paid', '2026-03-20', 'Deposit payment'),
((SELECT id FROM bookings WHERE reference_number='JH-2026-003'), 3798, 'USD', 'credit_card', 'paid', '2026-03-22', '50% advance payment'),
((SELECT id FROM bookings WHERE reference_number='JH-2026-005'), 2499, 'USD', 'credit_card', 'paid', '2026-03-10', 'First installment'),
((SELECT id FROM bookings WHERE reference_number='JH-2026-005'), 2499, 'USD', 'credit_card', 'paid', '2026-03-25', 'Final payment'),
((SELECT id FROM bookings WHERE reference_number='JH-2026-006'), 1500, 'USD', 'paypal', 'paid', '2026-03-18', 'Advance deposit');