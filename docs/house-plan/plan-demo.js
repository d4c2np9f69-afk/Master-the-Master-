/* plan-demo.js - SHOWCASE ONLY. NOT LIVE DATA.
 *
 * A snapshot of the entities this map reads, taken from Jeff's real house on
 * 2026-10-09. Used ONLY when the plan is opened WITHOUT an HA token - a shared link, a
 * browser bookmark, or Jeff showing someone. The instant it is opened from the HCC app,
 * poll() overwrites this with real state and none of it is used.
 *
 * WHY IT EXISTS: Jeff, 2026-10-08 - "I asked him to make the new house map look like it
 * was a live house with lights and working ceiling fans... it looks plain as hell I don't
 * like to even show people anymore." The living layer was real but only drew what was
 * happening, so at 5am with the A/C off and nothing watering, half the map was blank.
 *
 * Everything here is his house's real reported state EXCEPT these, set to a plausible
 * busy moment so the map demonstrates what it can do: switch.ac_relay on,
 * switch.z3_back_left on, the four machine links on, and the cans at their night levels.
 * The status bar says SHOWCASE / not live readings, so this can never be mistaken for
 * a reading. */
window.HCC_PLAN_DEMO = {
"alarm_control_panel.blink_loewen301":{
"entity_id":"alarm_control_panel.blink_loewen301",
"state":"armed_away",
"attributes":{
"code_format":null,
"changed_by":null,
"code_arm_required":false,
"name":"Loewen301",
"id":321907,
"network_id":228930,
"serial":"GNT2G60151340WMJ",
"version":"18.0.39",
"status":"online",
"region_id":"u064",
"local_storage":true,
"attribution":"Data provided by immedia-semi.com",
"friendly_name":"Blink Loewen301",
"supported_features":2
},
"last_changed":"2026-10-09T10:00:10.574423+00:00",
"last_updated":"2026-10-09T10:00:10.574423+00:00"
},
"binary_sensor.back_deck_door_contact":{
"entity_id":"binary_sensor.back_deck_door_contact",
"state":"off",
"attributes":{
"device_class":"door",
"friendly_name":"Back Deck Door Door"
},
"last_changed":"2026-10-09T00:27:28.925722+00:00",
"last_updated":"2026-10-09T00:27:28.925722+00:00"
},
"binary_sensor.front_door_contact":{
"entity_id":"binary_sensor.front_door_contact",
"state":"off",
"attributes":{
"device_class":"door",
"friendly_name":"Front Door Door"
},
"last_changed":"2026-10-08T21:39:13.415750+00:00",
"last_updated":"2026-10-08T21:39:13.415750+00:00"
},
"binary_sensor.garage_man_door_contact":{
"entity_id":"binary_sensor.garage_man_door_contact",
"state":"off",
"attributes":{
"device_class":"door",
"friendly_name":"Garage Man Door Door"
},
"last_changed":"2026-10-09T00:25:13.854161+00:00",
"last_updated":"2026-10-09T00:25:13.854161+00:00"
},
"binary_sensor.gle_350_engine_state":{
"entity_id":"binary_sensor.gle_350_engine_state",
"state":"off",
"attributes":{
"car":"4JGFB4KB0MA478988",
"vin":"4JGFB4KB0MA478988",
"retrievalstatus":"VALID",
"timestamp":"2026-10-07T15:36:30",
"icon":"mdi:engine",
"friendly_name":"GLE 350 Engine State"
},
"last_changed":"2026-10-08T23:01:09.471562+00:00",
"last_updated":"2026-10-08T23:01:09.471562+00:00"
},
"binary_sensor.hcc_machines_acer_laptop_online":{
"entity_id":"binary_sensor.hcc_machines_acer_laptop_online",
"state":"on",
"attributes":{
"device_class":"connectivity",
"friendly_name":"HCC Machines Acer laptop online"
},
"last_changed":"2026-10-09T03:31:02.825541+00:00",
"last_updated":"2026-10-09T03:31:02.825541+00:00"
},
"binary_sensor.hcc_machines_beast_online":{
"entity_id":"binary_sensor.hcc_machines_beast_online",
"state":"on",
"attributes":{
"device_class":"connectivity",
"friendly_name":"HCC Machines Beast online"
},
"last_changed":"2026-10-09T03:31:01.662335+00:00",
"last_updated":"2026-10-09T03:31:01.662335+00:00"
},
"binary_sensor.hcc_machines_garage_laptop_online":{
"entity_id":"binary_sensor.hcc_machines_garage_laptop_online",
"state":"on",
"attributes":{
"device_class":"connectivity",
"friendly_name":"HCC Machines Garage laptop online"
},
"last_changed":"2026-10-09T03:31:03.955332+00:00",
"last_updated":"2026-10-09T03:31:03.955332+00:00"
},
"binary_sensor.hcc_machines_kitchenpc_online":{
"entity_id":"binary_sensor.hcc_machines_kitchenpc_online",
"state":"on",
"attributes":{
"device_class":"connectivity",
"friendly_name":"HCC Machines KitchenPC online"
},
"last_changed":"2026-10-09T03:31:05.126985+00:00",
"last_updated":"2026-10-09T03:31:05.126985+00:00"
},
"binary_sensor.remote_ui":{
"entity_id":"binary_sensor.remote_ui",
"state":"on",
"attributes":{
"device_class":"connectivity",
"friendly_name":"Remote UI"
},
"last_changed":"2026-10-08T21:34:40.893952+00:00",
"last_updated":"2026-10-08T21:34:40.893952+00:00"
},
"binary_sensor.zigbee2mqtt_bridge_connection_state":{
"entity_id":"binary_sensor.zigbee2mqtt_bridge_connection_state",
"state":"on",
"attributes":{
"device_class":"connectivity",
"friendly_name":"Zigbee2MQTT Bridge Connection state"
},
"last_changed":"2026-10-08T21:38:38.413901+00:00",
"last_updated":"2026-10-08T21:38:38.413901+00:00"
},
"cover.garage_door":{
"entity_id":"cover.garage_door",
"state":"closed",
"attributes":{
"is_closed":true,
"current_position":0,
"device_class":"garage",
"friendly_name":"Garage Door",
"supported_features":3
},
"last_changed":"2026-10-08T21:34:42.284628+00:00",
"last_updated":"2026-10-08T21:34:42.284628+00:00"
},
"device_tracker.gle_350_device_tracker":{
"entity_id":"device_tracker.gle_350_device_tracker",
"state":"home",
"attributes":{
"tracking_type":"position",
"in_zones":[
"zone.home",
"zone.almost_home"
],
"source_type":"gps",
"latitude":36.476713,
"longitude":-86.660218,
"gps_accuracy":0,
"car":"4JGFB4KB0MA478988",
"vin":"4JGFB4KB0MA478988",
"retrievalstatus":"VALID",
"timestamp":"2026-10-07T15:36:30",
"positionHeading":150.2,
"friendly_name":"GLE 350 Device Tracker"
},
"last_changed":"2026-10-09T10:34:19.137469+00:00",
"last_updated":"2026-10-09T10:34:19.137469+00:00"
},
"input_boolean.air_conditioner":{
"entity_id":"input_boolean.air_conditioner",
"state":"on",
"attributes":{
"editable":true,
"icon":"mdi:air-conditioner",
"friendly_name":"Air Conditioner"
},
"last_changed":"2026-10-08T21:34:35.276894+00:00",
"last_updated":"2026-10-08T21:34:35.276894+00:00"
},
"input_boolean.grandfather_clock":{
"entity_id":"input_boolean.grandfather_clock",
"state":"on",
"attributes":{
"editable":true,
"icon":"mdi:clock-time-four",
"friendly_name":"Grandfather Clock"
},
"last_changed":"2026-10-08T21:34:35.277107+00:00",
"last_updated":"2026-10-08T21:34:35.277107+00:00"
},
"input_datetime.grandfather_clock_heartbeat":{
"entity_id":"input_datetime.grandfather_clock_heartbeat",
"state":"2026-10-09 05:33:28",
"attributes":{
"has_date":true,
"has_time":true,
"editable":true,
"year":2026,
"month":10,
"day":9,
"hour":5,
"minute":33,
"second":28,
"timestamp":1791542008.0,
"icon":"mdi:heart-pulse",
"friendly_name":"Grandfather Clock Heartbeat"
},
"last_changed":"2026-10-09T10:33:28.485556+00:00",
"last_updated":"2026-10-09T10:33:28.485556+00:00"
},
"light.bedroom_cans":{
"entity_id":"light.bedroom_cans",
"state":"on",
"attributes":{
"supported_color_modes":[
"brightness"
],
"color_mode":null,
"brightness":26,
"friendly_name":"Bedroom Cans ",
"supported_features":32
},
"last_changed":"2026-10-09T02:00:22.378236+00:00",
"last_updated":"2026-10-09T02:00:22.378236+00:00"
},
"light.floating_repeater":{
"entity_id":"light.floating_repeater",
"state":"on",
"attributes":{
"effect_list":[
"blink",
"breathe",
"okay",
"channel_change",
"finish_effect",
"stop_effect"
],
"supported_color_modes":[
"brightness"
],
"effect":null,
"color_mode":"brightness",
"brightness":255,
"friendly_name":"Floating Repeater",
"supported_features":44
},
"last_changed":"2026-10-08T21:39:13.450223+00:00",
"last_updated":"2026-10-08T21:39:13.450223+00:00"
},
"light.garage_repeater":{
"entity_id":"light.garage_repeater",
"state":"on",
"attributes":{
"effect_list":[
"blink",
"breathe",
"okay",
"channel_change",
"finish_effect",
"stop_effect"
],
"supported_color_modes":[
"brightness"
],
"effect":null,
"color_mode":"brightness",
"brightness":255,
"friendly_name":"Garage Repeater",
"supported_features":44
},
"last_changed":"2026-10-08T21:39:13.445755+00:00",
"last_updated":"2026-10-08T21:39:13.445755+00:00"
},
"light.kitchen_dining_room_cans":{
"entity_id":"light.kitchen_dining_room_cans",
"state":"on",
"attributes":{
"supported_color_modes":[
"brightness"
],
"color_mode":null,
"brightness":168,
"friendly_name":"Kitchen Dining Room Cans",
"supported_features":32
},
"last_changed":"2026-10-09T01:59:55.362788+00:00",
"last_updated":"2026-10-09T01:59:55.362788+00:00"
},
"light.livingroom_cans":{
"entity_id":"light.livingroom_cans",
"state":"on",
"attributes":{
"supported_color_modes":[
"brightness"
],
"color_mode":null,
"brightness":64,
"friendly_name":"Livingroom Cans",
"supported_features":32
},
"last_changed":"2026-10-09T01:59:55.354565+00:00",
"last_updated":"2026-10-09T01:59:55.354565+00:00"
},
"media_player.bedroom_apple_tv":{
"entity_id":"media_player.bedroom_apple_tv",
"state":"paused",
"attributes":{
"source_list":[
"App Store",
"Arcade",
"Calm",
"Computers",
"Controller for HomeKit",
"DIRECTV",
"ESPN",
"FaceTime",
"Fitness",
"Fox Nation",
"Fox News",
"HBO Max",
"HISTORY",
"Hulu",
"MLB",
"Movies",
"Music",
"Netflix",
"NFL",
"Paramount+",
"PBS",
"Photos",
"Podcasts",
"Prime Video",
"RadarScope",
"Search",
"Settings",
"Sling",
"Spectrum TV",
"Speedtest",
"The First TV",
"TV",
"TV Shows",
"VLC",
"YouTube"
],
"media_content_id":"a2473382-035b-4b0c-b2d6-c002595e3778",
"media_duration":2524,
"media_position":621,
"media_position_updated_at":"2026-10-09T07:44:08.847048+00:00",
"media_title":"Cosmic Collision, Haunted Hotel and Van Gogh's Ear",
"media_artist":"Mysteries at the Museum",
"app_id":"com.wbd.stream",
"app_name":"HBO Max",
"entity_picture":"/api/media_player_proxy/media_player.bedroom_apple_tv?token=abfa227bc746331d8595eba87e6c5ad3bc0bbd785624ccc5a26ac048dd81edc2&cache=66fc51afc2599bd1",
"friendly_name":"Apple TV ",
"supported_features":450487
},
"last_changed":"2026-10-09T07:44:08.842905+00:00",
"last_updated":"2026-10-09T07:44:08.848830+00:00"
},
"media_player.fire_tv_viewing_room":{
"entity_id":"media_player.fire_tv_viewing_room",
"state":"off",
"attributes":{
"adb_response":null,
"hdmi_input":null,
"device_class":"tv",
"friendly_name":"Living Room Fire TV 4K",
"supported_features":22961
},
"last_changed":"2026-10-08T23:25:55.053132+00:00",
"last_updated":"2026-10-08T23:25:55.053132+00:00"
},
"media_player.jeffrey_s_fire_tv":{
"entity_id":"media_player.jeffrey_s_fire_tv",
"state":"idle",
"attributes":{
"volume_level":0.0,
"is_volume_muted":false,
"media_content_type":"idle",
"media_position_updated_at":"2026-10-08T21:35:14.169488+00:00",
"available":true,
"last_called":false,
"last_called_timestamp":null,
"last_called_summary":null,
"last_called_response":null,
"connected_bluetooth":null,
"bluetooth_list":[],
"history_records":[],
"previous_volume":null,
"friendly_name":"Living Room Fire TV Stick 4K Max",
"supported_features":318399
},
"last_changed":"2026-10-08T21:35:03.533452+00:00",
"last_updated":"2026-10-08T23:25:51.994302+00:00"
},
"media_player.living_room_echo_dot":{
"entity_id":"media_player.living_room_echo_dot",
"state":"idle",
"attributes":{
"source_list":[
"Local Speaker",
"Jeff’s iPhone 16 Pro Max"
],
"volume_level":0.3,
"is_volume_muted":false,
"media_content_type":"idle",
"media_position_updated_at":"2026-10-08T21:35:14.352669+00:00",
"source":"Local Speaker",
"available":true,
"last_called":false,
"last_called_timestamp":1791511192953,
"last_called_summary":"turn off all the lights in the house",
"last_called_response":"Okay.",
"connected_bluetooth":null,
"bluetooth_list":[
"Jeff’s iPhone 16 Pro Max"
],
"history_records":[],
"previous_volume":null,
"friendly_name":"Living Room Echo Dot",
"supported_features":318399
},
"last_changed":"2026-10-08T21:35:03.538936+00:00",
"last_updated":"2026-10-09T02:00:11.532545+00:00"
},
"media_player.master_bedroom":{
"entity_id":"media_player.master_bedroom",
"state":"idle",
"attributes":{
"is_volume_muted":false,
"media_content_type":"idle",
"media_position_updated_at":"2026-10-08T21:35:14.261599+00:00",
"available":true,
"last_called":false,
"last_called_timestamp":null,
"last_called_summary":null,
"last_called_response":null,
"connected_bluetooth":null,
"bluetooth_list":[],
"history_records":[],
"previous_volume":null,
"friendly_name":"Master Bedroom",
"supported_features":318399
},
"last_changed":"2026-10-08T21:35:03.537070+00:00",
"last_updated":"2026-10-08T21:35:14.262021+00:00"
},
"sensor.0xa4c138140f3ce43d_linkquality":{
"entity_id":"sensor.0xa4c138140f3ce43d_linkquality",
"state":"80",
"attributes":{
"state_class":"measurement",
"unit_of_measurement":"lqi",
"icon":"mdi:signal",
"friendly_name":"Floating Repeater Linkquality"
},
"last_changed":"2026-10-08T21:39:13.449673+00:00",
"last_updated":"2026-10-08T21:39:13.449673+00:00"
},
"sensor.0xa4c1386f3deff62d_linkquality":{
"entity_id":"sensor.0xa4c1386f3deff62d_linkquality",
"state":"29",
"attributes":{
"state_class":"measurement",
"unit_of_measurement":"lqi",
"icon":"mdi:signal",
"friendly_name":"Garage Repeater Linkquality"
},
"last_changed":"2026-10-08T21:39:13.446366+00:00",
"last_updated":"2026-10-08T21:39:13.446366+00:00"
},
"sensor.301_alarm_linkquality":{
"entity_id":"sensor.301_alarm_linkquality",
"state":"149",
"attributes":{
"state_class":"measurement",
"unit_of_measurement":"lqi",
"icon":"mdi:signal",
"friendly_name":"301 Alarm Linkquality"
},
"last_changed":"2026-10-08T21:39:13.489618+00:00",
"last_updated":"2026-10-08T21:39:13.489618+00:00"
},
"sensor.electric_smarthub_energy_monthly_usage_4501007001_electric_smarthub_energy_monthly_usage_4501007001":{
"entity_id":"sensor.electric_smarthub_energy_monthly_usage_4501007001_electric_smarthub_energy_monthly_usage_4501007001",
"state":"300.0",
"attributes":{
"state_class":"total_increasing",
"account_id":"4501007001",
"location_id":"16290",
"last_reading_time":"2026-10-09T00:00:00-05:00",
"meter_name":"145590962",
"unit_of_measurement":"kWh",
"device_class":"energy",
"icon":"mdi:lightning-bolt",
"friendly_name":"Electric SmartHub Energy Monthly Usage (4501007001 - ) Electric SmartHub Energy Monthly Usage - 4501007001 "
},
"last_changed":"2026-10-08T21:34:57.779031+00:00",
"last_updated":"2026-10-09T05:08:58.550230+00:00"
},
"sensor.gas_meter_last_seen":{
"entity_id":"sensor.gas_meter_last_seen",
"state":"2026-10-09T10:34:24+00:00",
"attributes":{
"device_class":"timestamp",
"friendly_name":"gas_meter Last Seen"
},
"last_changed":"2026-10-09T10:34:24.364356+00:00",
"last_updated":"2026-10-09T10:34:24.364356+00:00"
},
"sensor.my_weather_station_humidity":{
"entity_id":"sensor.my_weather_station_humidity",
"state":"86",
"attributes":{
"state_class":"measurement",
"unit_of_measurement":"%",
"device_class":"humidity",
"friendly_name":"My weather station Humidity"
},
"last_changed":"2026-10-09T10:32:41.585535+00:00",
"last_updated":"2026-10-09T10:32:41.585535+00:00"
},
"sensor.my_weather_station_inside_temperature":{
"entity_id":"sensor.my_weather_station_inside_temperature",
"state":"67.6",
"attributes":{
"state_class":"measurement",
"unit_of_measurement":"°F",
"device_class":"temperature",
"friendly_name":"My weather station Inside temperature"
},
"last_changed":"2026-10-09T10:31:41.761265+00:00",
"last_updated":"2026-10-09T10:31:41.761265+00:00"
},
"sensor.my_weather_station_precipitation_intensity":{
"entity_id":"sensor.my_weather_station_precipitation_intensity",
"state":"0",
"attributes":{
"state_class":"measurement",
"unit_of_measurement":"in/h",
"device_class":"precipitation_intensity",
"friendly_name":"My weather station Precipitation intensity"
},
"last_changed":"2026-10-08T21:34:57.135307+00:00",
"last_updated":"2026-10-08T21:34:57.135307+00:00"
},
"sensor.my_weather_station_temperature":{
"entity_id":"sensor.my_weather_station_temperature",
"state":"52.2",
"attributes":{
"state_class":"measurement",
"unit_of_measurement":"°F",
"device_class":"temperature",
"friendly_name":"My weather station Temperature"
},
"last_changed":"2026-10-09T10:21:41.587303+00:00",
"last_updated":"2026-10-09T10:21:41.587303+00:00"
},
"sensor.my_weather_station_wind_direction":{
"entity_id":"sensor.my_weather_station_wind_direction",
"state":"227",
"attributes":{
"state_class":"measurement_angle",
"unit_of_measurement":"°",
"device_class":"wind_direction",
"friendly_name":"My weather station Wind direction"
},
"last_changed":"2026-10-09T10:34:41.595617+00:00",
"last_updated":"2026-10-09T10:34:41.595617+00:00"
},
"sensor.my_weather_station_wind_speed":{
"entity_id":"sensor.my_weather_station_wind_speed",
"state":"0",
"attributes":{
"state_class":"measurement",
"unit_of_measurement":"mph",
"device_class":"wind_speed",
"friendly_name":"My weather station Wind speed"
},
"last_changed":"2026-10-08T22:45:41.992471+00:00",
"last_updated":"2026-10-08T22:45:41.992471+00:00"
},
"sensor.sharky_battery":{
"entity_id":"sensor.sharky_battery",
"state":"100.0",
"attributes":{
"state_class":"measurement",
"unit_of_measurement":"%",
"device_class":"battery",
"friendly_name":"Sharky Battery"
},
"last_changed":"2026-10-08T21:34:57.111628+00:00",
"last_updated":"2026-10-08T21:34:57.111628+00:00"
},
"sensor.water_flow":{
"entity_id":"sensor.water_flow",
"state":"0.002",
"attributes":{
"state_class":"measurement",
"source":"sensor.water_gallons",
"unit_of_measurement":"gal/min",
"device_class":"volume_flow_rate",
"friendly_name":"Water Flow"
},
"last_changed":"2026-10-09T06:01:28.160307+00:00",
"last_updated":"2026-10-09T06:01:28.160307+00:00"
},
"sensor.water_meter_last_seen":{
"entity_id":"sensor.water_meter_last_seen",
"state":"2026-10-09T10:32:58+00:00",
"attributes":{
"device_class":"timestamp",
"friendly_name":"water_meter Last Seen"
},
"last_changed":"2026-10-09T10:32:58.798197+00:00",
"last_updated":"2026-10-09T10:32:58.798197+00:00"
},
"switch.ac_relay":{
"entity_id":"switch.ac_relay",
"state":"on",
"attributes":{
"device_class":"outlet",
"friendly_name":"A/C Relay"
},
"last_changed":"2026-10-09T04:15:41.313385+00:00",
"last_updated":"2026-10-09T04:15:41.313385+00:00"
},
"switch.bed_lamp_socket_1":{
"entity_id":"switch.bed_lamp_socket_1",
"state":"on",
"attributes":{
"device_class":"outlet",
"friendly_name":"Jeff’s Bed lamp Socket 1"
},
"last_changed":"2026-10-09T03:52:07.059284+00:00",
"last_updated":"2026-10-09T03:52:07.059284+00:00"
},
"switch.garage_garage_door_opener":{
"entity_id":"switch.garage_garage_door_opener",
"state":"off",
"attributes":{
"device_class":"outlet",
"friendly_name":"Garage Door Opener "
},
"last_changed":"2026-10-08T21:34:50.809697+00:00",
"last_updated":"2026-10-08T21:34:50.809697+00:00"
},
"switch.garden":{
"entity_id":"switch.garden",
"state":"off",
"attributes":{
"station":6,
"zone_name":"Garden",
"run_mode":"auto",
"rain_delay":0,
"connected":true,
"is_watering":false,
"icon":"mdi:sprinkler",
"friendly_name":"Garden"
},
"last_changed":"2026-10-08T21:34:57.531627+00:00",
"last_updated":"2026-10-08T21:34:57.531627+00:00"
},
"switch.hot_water_heater_socket_1":{
"entity_id":"switch.hot_water_heater_socket_1",
"state":"off",
"attributes":{
"device_class":"outlet",
"friendly_name":"    Hot Water Circulation Pump Socket 1"
},
"last_changed":"2026-10-08T21:34:57.115383+00:00",
"last_updated":"2026-10-08T21:34:57.115383+00:00"
},
"switch.masterbath_cans":{
"entity_id":"switch.masterbath_cans",
"state":"off",
"attributes":{
"friendly_name":"Masterbath cans "
},
"last_changed":"2026-10-09T03:14:27.932364+00:00",
"last_updated":"2026-10-09T03:14:27.932364+00:00"
},
"switch.mini_smart_socket11_2_socket_1":{
"entity_id":"switch.mini_smart_socket11_2_socket_1",
"state":"off",
"attributes":{
"device_class":"outlet",
"friendly_name":"Garage fan  Socket 1"
},
"last_changed":"2026-10-08T21:34:57.114421+00:00",
"last_updated":"2026-10-08T21:34:57.114421+00:00"
},
"switch.smart_socket_2_socket_1":{
"entity_id":"switch.smart_socket_2_socket_1",
"state":"off",
"attributes":{
"device_class":"outlet",
"friendly_name":"Angela’s Bed Lamp  Socket 1"
},
"last_changed":"2026-10-09T03:23:23.037794+00:00",
"last_updated":"2026-10-09T03:23:23.037794+00:00"
},
"switch.z1_front_right":{
"entity_id":"switch.z1_front_right",
"state":"off",
"attributes":{
"station":1,
"zone_name":"Z1 Front right",
"run_mode":"auto",
"rain_delay":0,
"connected":true,
"is_watering":false,
"icon":"mdi:sprinkler",
"friendly_name":"Z1 Front right"
},
"last_changed":"2026-10-08T21:34:57.855642+00:00",
"last_updated":"2026-10-08T21:34:57.855642+00:00"
},
"switch.z2_front_left":{
"entity_id":"switch.z2_front_left",
"state":"off",
"attributes":{
"station":2,
"zone_name":"Z2 Front Left",
"run_mode":"auto",
"rain_delay":0,
"connected":true,
"is_watering":false,
"icon":"mdi:sprinkler",
"friendly_name":"Z2 Front Left"
},
"last_changed":"2026-10-08T21:34:57.529904+00:00",
"last_updated":"2026-10-08T21:34:57.529904+00:00"
},
"switch.z3_back_left":{
"entity_id":"switch.z3_back_left",
"state":"on",
"attributes":{
"station":3,
"zone_name":"Z3 Back Left",
"run_mode":"auto",
"rain_delay":0,
"connected":true,
"is_watering":false,
"icon":"mdi:sprinkler",
"friendly_name":"Z3 Back Left"
},
"last_changed":"2026-10-08T21:34:57.530356+00:00",
"last_updated":"2026-10-08T21:34:57.530356+00:00"
},
"switch.z4_back_right":{
"entity_id":"switch.z4_back_right",
"state":"off",
"attributes":{
"station":4,
"zone_name":"Z4 Back Right",
"run_mode":"auto",
"rain_delay":0,
"connected":true,
"is_watering":false,
"icon":"mdi:sprinkler",
"friendly_name":"Z4 Back Right"
},
"last_changed":"2026-10-08T21:34:57.530627+00:00",
"last_updated":"2026-10-08T21:34:57.530627+00:00"
},
"switch.z5_right_side_drive":{
"entity_id":"switch.z5_right_side_drive",
"state":"off",
"attributes":{
"station":5,
"zone_name":"Z5 Right Side Drive",
"run_mode":"auto",
"rain_delay":0,
"connected":true,
"is_watering":false,
"icon":"mdi:sprinkler",
"friendly_name":"Z5 Right Side Drive"
},
"last_changed":"2026-10-08T21:34:57.531138+00:00",
"last_updated":"2026-10-08T21:34:57.531138+00:00"
},
"vacuum.sharky":{
"entity_id":"vacuum.sharky",
"state":"docked",
"attributes":{
"fan_speed_list":[
"gentle",
"normal",
"strong"
],
"fan_speed":null,
"friendly_name":"Sharky",
"supported_features":13116
},
"last_changed":"2026-10-08T21:34:57.118135+00:00",
"last_updated":"2026-10-08T21:34:57.118135+00:00"
},
"binary_sensor.hcc_machines_house_mesh_healthy_online":{
"entity_id":"binary_sensor.hcc_machines_house_mesh_healthy_online",
"state":"on",
"attributes":{},
"last_changed":null,
"last_updated":null
}
};
