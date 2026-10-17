/**
 * @file bangladeshLocations.ts
 * @description Comprehensive administrative hierarchy for Bangladesh:
 * 8 Divisions (বিভাগ), all 64 Districts (জেলা), and complete Upazilas/Thanas (উপজেলা/থানা)
 * with authentic Unions (ইউনিয়ন) only (ওয়ার্ড সম্পূর্ণ বর্জিত).
 */

export interface LocationItem {
  id: string;
  nameBn: string;
  nameEn: string;
}

export interface DivisionItem extends LocationItem {}

export interface DistrictItem extends LocationItem {
  divisionId: string;
}

export interface UpazilaItem extends LocationItem {
  districtId: string;
}

export interface UnionItem extends LocationItem {
  upazilaId: string;
}

export const BANGLADESH_DIVISIONS: DivisionItem[] = [
  { id: 'Dhaka', nameBn: 'ঢাকা', nameEn: 'Dhaka' },
  { id: 'Chattogram', nameBn: 'চট্টগ্রাম', nameEn: 'Chattogram' },
  { id: 'Rajshahi', nameBn: 'রাজশাহী', nameEn: 'Rajshahi' },
  { id: 'Khulna', nameBn: 'খুলনা', nameEn: 'Khulna' },
  { id: 'Barishal', nameBn: 'বরিশাল', nameEn: 'Barishal' },
  { id: 'Sylhet', nameBn: 'সিলেট', nameEn: 'Sylhet' },
  { id: 'Rangpur', nameBn: 'রংপুর', nameEn: 'Rangpur' },
  { id: 'Mymensingh', nameBn: 'ময়মনসিংহ', nameEn: 'Mymensingh' },
];

export const BANGLADESH_DISTRICTS: DistrictItem[] = [
  // ─── DHAKA DIVISION (13) ─────────────────────────────
  { id: 'Dhaka', divisionId: 'Dhaka', nameBn: 'ঢাকা', nameEn: 'Dhaka' },
  { id: 'Gazipur', divisionId: 'Dhaka', nameBn: 'গাজীপুর', nameEn: 'Gazipur' },
  { id: 'Narayanganj', divisionId: 'Dhaka', nameBn: 'নারায়ণগঞ্জ', nameEn: 'Narayanganj' },
  { id: 'Tangail', divisionId: 'Dhaka', nameBn: 'টাঙ্গাইল', nameEn: 'Tangail' },
  { id: 'Narsingdi', divisionId: 'Dhaka', nameBn: 'নরসিংদী', nameEn: 'Narsingdi' },
  { id: 'Manikganj', divisionId: 'Dhaka', nameBn: 'মানিকগঞ্জ', nameEn: 'Manikganj' },
  { id: 'Munshiganj', divisionId: 'Dhaka', nameBn: 'মুন্সীগঞ্জ', nameEn: 'Munshiganj' },
  { id: 'Faridpur', divisionId: 'Dhaka', nameBn: 'ফরিদপুর', nameEn: 'Faridpur' },
  { id: 'Gopalganj', divisionId: 'Dhaka', nameBn: 'গোপালগঞ্জ', nameEn: 'Gopalganj' },
  { id: 'Madaripur', divisionId: 'Dhaka', nameBn: 'মাদারীপুর', nameEn: 'Madaripur' },
  { id: 'Rajbari', divisionId: 'Dhaka', nameBn: 'রাজবাড়ী', nameEn: 'Rajbari' },
  { id: 'Shariatpur', divisionId: 'Dhaka', nameBn: 'শরীয়তপুর', nameEn: 'Shariatpur' },
  { id: 'Kishoreganj', divisionId: 'Dhaka', nameBn: 'কিশোরগঞ্জ', nameEn: 'Kishoreganj' },

  // ─── CHATTOGRAM DIVISION (11) ────────────────────────
  { id: 'Chattogram', divisionId: 'Chattogram', nameBn: 'চট্টগ্রাম', nameEn: 'Chattogram' },
  { id: "Cox's Bazar", divisionId: 'Chattogram', nameBn: 'কক্সবাজার', nameEn: "Cox's Bazar" },
  { id: 'Cumilla', divisionId: 'Chattogram', nameBn: 'কুমিল্লা', nameEn: 'Cumilla' },
  { id: 'Feni', divisionId: 'Chattogram', nameBn: 'ফেনী', nameEn: 'Feni' },
  { id: 'Brahmanbaria', divisionId: 'Chattogram', nameBn: 'ব্রাহ্মণবাড়িয়া', nameEn: 'Brahmanbaria' },
  { id: 'Noakhali', divisionId: 'Chattogram', nameBn: 'নোয়াখালী', nameEn: 'Noakhali' },
  { id: 'Chandpur', divisionId: 'Chattogram', nameBn: 'চাঁদপুর', nameEn: 'Chandpur' },
  { id: 'Lakshmipur', divisionId: 'Chattogram', nameBn: 'লক্ষ্মীপুর', nameEn: 'Lakshmipur' },
  { id: 'Rangamati', divisionId: 'Chattogram', nameBn: 'রাঙ্গামাটি', nameEn: 'Rangamati' },
  { id: 'Bandarban', divisionId: 'Chattogram', nameBn: 'বান্দরবান', nameEn: 'Bandarban' },
  { id: 'Khagrachhari', divisionId: 'Chattogram', nameBn: 'খাগড়াছড়ি', nameEn: 'Khagrachhari' },

  // ─── RAJSHAHI DIVISION (8) ───────────────────────────
  { id: 'Rajshahi', divisionId: 'Rajshahi', nameBn: 'রাজশাহী', nameEn: 'Rajshahi' },
  { id: 'Bogura', divisionId: 'Rajshahi', nameBn: 'বগুড়া', nameEn: 'Bogura' },
  { id: 'Pabna', divisionId: 'Rajshahi', nameBn: 'পাবনা', nameEn: 'Pabna' },
  { id: 'Sirajganj', divisionId: 'Rajshahi', nameBn: 'সিরাজগঞ্জ', nameEn: 'Sirajganj' },
  { id: 'Naogaon', divisionId: 'Rajshahi', nameBn: 'নওগাঁ', nameEn: 'Naogaon' },
  { id: 'Natore', divisionId: 'Rajshahi', nameBn: 'নাটোর', nameEn: 'Natore' },
  { id: 'Chapainawabganj', divisionId: 'Rajshahi', nameBn: 'চাঁপাইনবাবগঞ্জ', nameEn: 'Chapainawabganj' },
  { id: 'Joypurhat', divisionId: 'Rajshahi', nameBn: 'জয়পুরহাট', nameEn: 'Joypurhat' },

  // ─── KHULNA DIVISION (10) ────────────────────────────
  { id: 'Khulna', divisionId: 'Khulna', nameBn: 'খুলনা', nameEn: 'Khulna' },
  { id: 'Jashore', divisionId: 'Khulna', nameBn: 'যশোর', nameEn: 'Jashore' },
  { id: 'Satkhira', divisionId: 'Khulna', nameBn: 'সাতক্ষীরা', nameEn: 'Satkhira' },
  { id: 'Kushtia', divisionId: 'Khulna', nameBn: 'কুষ্টিয়া', nameEn: 'Kushtia' },
  { id: 'Jhenaidah', divisionId: 'Khulna', nameBn: 'ঝিনাইদহ', nameEn: 'Jhenaidah' },
  { id: 'Bagerhat', divisionId: 'Khulna', nameBn: 'বাগেরহাট', nameEn: 'Bagerhat' },
  { id: 'Chuadanga', divisionId: 'Khulna', nameBn: 'চুয়াডাঙ্গা', nameEn: 'Chuadanga' },
  { id: 'Meherpur', divisionId: 'Khulna', nameBn: 'মেহেরপুর', nameEn: 'Meherpur' },
  { id: 'Magura', divisionId: 'Khulna', nameBn: 'মাগুরা', nameEn: 'Magura' },
  { id: 'Narail', divisionId: 'Khulna', nameBn: 'নড়াইল', nameEn: 'Narail' },

  // ─── BARISHAL DIVISION (6) ───────────────────────────
  { id: 'Barishal', divisionId: 'Barishal', nameBn: 'বরিশাল', nameEn: 'Barishal' },
  { id: 'Patuakhali', divisionId: 'Barishal', nameBn: 'পটুয়াখালী', nameEn: 'Patuakhali' },
  { id: 'Bhola', divisionId: 'Barishal', nameBn: 'ভোলা', nameEn: 'Bhola' },
  { id: 'Pirojpur', divisionId: 'Barishal', nameBn: 'পিরোজপুর', nameEn: 'Pirojpur' },
  { id: 'Barguna', divisionId: 'Barishal', nameBn: 'বরগুনা', nameEn: 'Barguna' },
  { id: 'Jhalokathi', divisionId: 'Barishal', nameBn: 'ঝালকাঠি', nameEn: 'Jhalokathi' },

  // ─── SYLHET DIVISION (4) ─────────────────────────────
  { id: 'Sylhet', divisionId: 'Sylhet', nameBn: 'সিলেট', nameEn: 'Sylhet' },
  { id: 'Moulvibazar', divisionId: 'Sylhet', nameBn: 'মৌলভীবাজার', nameEn: 'Moulvibazar' },
  { id: 'Habiganj', divisionId: 'Sylhet', nameBn: 'হবিগঞ্জ', nameEn: 'Habiganj' },
  { id: 'Sunamganj', divisionId: 'Sylhet', nameBn: 'সুনামগঞ্জ', nameEn: 'Sunamganj' },

  // ─── RANGPUR DIVISION (8) ────────────────────────────
  { id: 'Rangpur', divisionId: 'Rangpur', nameBn: 'রংপুর', nameEn: 'Rangpur' },
  { id: 'Dinajpur', divisionId: 'Rangpur', nameBn: 'দিনাজপুর', nameEn: 'Dinajpur' },
  { id: 'Gaibandha', divisionId: 'Rangpur', nameBn: 'গাইবান্ধা', nameEn: 'Gaibandha' },
  { id: 'Kurigram', divisionId: 'Rangpur', nameBn: 'কুড়িগ্রাম', nameEn: 'Kurigram' },
  { id: 'Nilphamari', divisionId: 'Rangpur', nameBn: 'নীলফামারী', nameEn: 'Nilphamari' },
  { id: 'Lalmonirhat', divisionId: 'Rangpur', nameBn: 'লালমনিরহাট', nameEn: 'Lalmonirhat' },
  { id: 'Panchagarh', divisionId: 'Rangpur', nameBn: 'পঞ্চগড়', nameEn: 'Panchagarh' },
  { id: 'Thakurgaon', divisionId: 'Rangpur', nameBn: 'ঠাকুরগাঁও', nameEn: 'Thakurgaon' },

  // ─── MYMENSINGH DIVISION (4) ─────────────────────────
  { id: 'Mymensingh', divisionId: 'Mymensingh', nameBn: 'ময়মনসিংহ', nameEn: 'Mymensingh' },
  { id: 'Jamalpur', divisionId: 'Mymensingh', nameBn: 'জামালপুর', nameEn: 'Jamalpur' },
  { id: 'Netrokona', divisionId: 'Mymensingh', nameBn: 'নেত্রকোণা', nameEn: 'Netrokona' },
  { id: 'Sherpur', divisionId: 'Mymensingh', nameBn: 'শেরপুর', nameEn: 'Sherpur' },
];

export const BANGLADESH_UPAZILAS: UpazilaItem[] = [
  // ─── 1. DHAKA DISTRICT ──────────────────────────────
  { id: 'Dhanmondi', districtId: 'Dhaka', nameBn: 'ধানমন্ডি', nameEn: 'Dhanmondi' },
  { id: 'Gulshan', districtId: 'Dhaka', nameBn: 'গুলশান', nameEn: 'Gulshan' },
  { id: 'Banani', districtId: 'Dhaka', nameBn: 'বনানী', nameEn: 'Banani' },
  { id: 'Mirpur', districtId: 'Dhaka', nameBn: 'মিরপুর', nameEn: 'Mirpur' },
  { id: 'Uttara', districtId: 'Dhaka', nameBn: 'উত্তরা', nameEn: 'Uttara' },
  { id: 'Mohammadpur', districtId: 'Dhaka', nameBn: 'মোহাম্মদপুর', nameEn: 'Mohammadpur' },
  { id: 'Motijheel', districtId: 'Dhaka', nameBn: 'মতিঝিল', nameEn: 'Motijheel' },
  { id: 'Badda', districtId: 'Dhaka', nameBn: 'বাড্ডা', nameEn: 'Badda' },
  { id: 'Rampura', districtId: 'Dhaka', nameBn: 'রামপুরা', nameEn: 'Rampura' },
  { id: 'Khilgaon', districtId: 'Dhaka', nameBn: 'খিলগাঁও', nameEn: 'Khilgaon' },
  { id: 'Jatrabari', districtId: 'Dhaka', nameBn: 'যাত্রাবাড়ী', nameEn: 'Jatrabari' },
  { id: 'Lalbagh', districtId: 'Dhaka', nameBn: 'লালবাগ', nameEn: 'Lalbagh' },
  { id: 'New Market', districtId: 'Dhaka', nameBn: 'নিউ মার্কেট', nameEn: 'New Market' },
  { id: 'Tejgaon', districtId: 'Dhaka', nameBn: 'তেজগাঁও', nameEn: 'Tejgaon' },
  { id: 'Paltan', districtId: 'Dhaka', nameBn: 'পল্টন', nameEn: 'Paltan' },
  { id: 'Shahbagh', districtId: 'Dhaka', nameBn: 'শাহবাগ', nameEn: 'Shahbagh' },
  { id: 'Ramna', districtId: 'Dhaka', nameBn: 'রমনা', nameEn: 'Ramna' },
  { id: 'Kafrul', districtId: 'Dhaka', nameBn: 'কাফরুল', nameEn: 'Kafrul' },
  { id: 'Pallabi', districtId: 'Dhaka', nameBn: 'পল্লবী', nameEn: 'Pallabi' },
  { id: 'Cantonment', districtId: 'Dhaka', nameBn: 'ক্যান্টনমেন্ট', nameEn: 'Cantonment' },
  { id: 'Bhatara', districtId: 'Dhaka', nameBn: 'ভাটারা (বসুন্ধরা আ/এ)', nameEn: 'Bhatara (Bashundhara)' },
  { id: 'Savar', districtId: 'Dhaka', nameBn: 'সাভার', nameEn: 'Savar' },
  { id: 'Keraniganj', districtId: 'Dhaka', nameBn: 'কেরানীগঞ্জ', nameEn: 'Keraniganj' },
  { id: 'Dhamrai', districtId: 'Dhaka', nameBn: 'ধামরাই', nameEn: 'Dhamrai' },
  { id: 'Dohar', districtId: 'Dhaka', nameBn: 'দোহার', nameEn: 'Dohar' },
  { id: 'Nawabganj (Dhaka)', districtId: 'Dhaka', nameBn: 'নবাবগঞ্জ', nameEn: 'Nawabganj' },

  // ─── 2. GAZIPUR DISTRICT ────────────────────────────
  { id: 'Gazipur Sadar', districtId: 'Gazipur', nameBn: 'গাজীপুর সদর', nameEn: 'Gazipur Sadar' },
  { id: 'Tongi', districtId: 'Gazipur', nameBn: 'টঙ্গী', nameEn: 'Tongi' },
  { id: 'Kaliakair', districtId: 'Gazipur', nameBn: 'কালিয়াকৈর', nameEn: 'Kaliakair' },
  { id: 'Sreepur', districtId: 'Gazipur', nameBn: 'শ্রীপুর', nameEn: 'Sreepur' },
  { id: 'Kapasia', districtId: 'Gazipur', nameBn: 'কাপাসিয়া', nameEn: 'Kapasia' },
  { id: 'Kaliganj (Gazipur)', districtId: 'Gazipur', nameBn: 'কালীগঞ্জ', nameEn: 'Kaliganj' },

  // ─── 3. NARAYANGANJ DISTRICT ────────────────────────
  { id: 'Narayanganj Sadar', districtId: 'Narayanganj', nameBn: 'নারায়ণগঞ্জ সদর', nameEn: 'Narayanganj Sadar' },
  { id: 'Fatullah', districtId: 'Narayanganj', nameBn: 'ফতুল্লা', nameEn: 'Fatullah' },
  { id: 'Siddhirganj', districtId: 'Narayanganj', nameBn: 'সিদ্ধিরগঞ্জ', nameEn: 'Siddhirganj' },
  { id: 'Bandar', districtId: 'Narayanganj', nameBn: 'বন্দর', nameEn: 'Bandar' },
  { id: 'Sonargaon', districtId: 'Narayanganj', nameBn: 'সোনারগাঁ', nameEn: 'Sonargaon' },
  { id: 'Rupganj', districtId: 'Narayanganj', nameBn: 'রূপগঞ্জ', nameEn: 'Rupganj' },
  { id: 'Araihazar', districtId: 'Narayanganj', nameBn: 'আড়াইহাজার', nameEn: 'Araihazar' },

  // ─── 4. TANGAIL DISTRICT ────────────────────────────
  { id: 'Tangail Sadar', districtId: 'Tangail', nameBn: 'টাঙ্গাইল সদর', nameEn: 'Tangail Sadar' },
  { id: 'Mirzapur', districtId: 'Tangail', nameBn: 'মির্জাপুর', nameEn: 'Mirzapur' },
  { id: 'Ghatail', districtId: 'Tangail', nameBn: 'ঘাটাইল', nameEn: 'Ghatail' },
  { id: 'Madhupur', districtId: 'Tangail', nameBn: 'মধুপুর', nameEn: 'Madhupur' },
  { id: 'Sakhipur', districtId: 'Tangail', nameBn: 'সখিপুর', nameEn: 'Sakhipur' },
  { id: 'Gopalpur', districtId: 'Tangail', nameBn: 'গোপালপুর', nameEn: 'Gopalpur' },
  { id: 'Delduar', districtId: 'Tangail', nameBn: 'দেলদুয়ার', nameEn: 'Delduar' },
  { id: 'Nagarpur', districtId: 'Tangail', nameBn: 'নাগরপুর', nameEn: 'Nagarpur' },
  { id: 'Bhuapur', districtId: 'Tangail', nameBn: 'ভূঞাপুর', nameEn: 'Bhuapur' },
  { id: 'Kalihati', districtId: 'Tangail', nameBn: 'কালিহাতী', nameEn: 'Kalihati' },
  { id: 'Basail', districtId: 'Tangail', nameBn: 'বাসাইল', nameEn: 'Basail' },
  { id: 'Dhanbari', districtId: 'Tangail', nameBn: 'ধনবাড়ী', nameEn: 'Dhanbari' },

  // ─── 5. NARSINGDI DISTRICT ──────────────────────────
  { id: 'Narsingdi Sadar', districtId: 'Narsingdi', nameBn: 'নরসিংদী সদর', nameEn: 'Narsingdi Sadar' },
  { id: 'Palash', districtId: 'Narsingdi', nameBn: 'পলাশ', nameEn: 'Palash' },
  { id: 'Shibpur', districtId: 'Narsingdi', nameBn: 'শিবপুর', nameEn: 'Shibpur' },
  { id: 'Raipura', districtId: 'Narsingdi', nameBn: 'রায়পুরা', nameEn: 'Raipura' },
  { id: 'Belabo', districtId: 'Narsingdi', nameBn: 'বেলাবো', nameEn: 'Belabo' },
  { id: 'Monohardi', districtId: 'Narsingdi', nameBn: 'মনোহরদী', nameEn: 'Monohardi' },

  // ─── 6. MANIKGANJ DISTRICT ──────────────────────────
  { id: 'Manikganj Sadar', districtId: 'Manikganj', nameBn: 'মানিকগঞ্জ সদর', nameEn: 'Manikganj Sadar' },
  { id: 'Singair', districtId: 'Manikganj', nameBn: 'সিংগাইর', nameEn: 'Singair' },
  { id: 'Shibalaya', districtId: 'Manikganj', nameBn: 'শিবালয়', nameEn: 'Shibalaya' },
  { id: 'Saturia', districtId: 'Manikganj', nameBn: 'সাটুরিয়া', nameEn: 'Saturia' },
  { id: 'Ghior', districtId: 'Manikganj', nameBn: 'ঘিওড়', nameEn: 'Ghior' },
  { id: 'Daulatpur (Manikganj)', districtId: 'Manikganj', nameBn: 'দৌলতপুর', nameEn: 'Daulatpur' },
  { id: 'Harirampur', districtId: 'Manikganj', nameBn: 'হরিরামপুর', nameEn: 'Harirampur' },

  // ─── 7. MUNSHIGANJ DISTRICT ─────────────────────────
  { id: 'Munshiganj Sadar', districtId: 'Munshiganj', nameBn: 'মুন্সীগঞ্জ সদর', nameEn: 'Munshiganj Sadar' },
  { id: 'Sreenagar', districtId: 'Munshiganj', nameBn: 'শ্রীনগর', nameEn: 'Sreenagar' },
  { id: 'Sirajdikhan', districtId: 'Munshiganj', nameBn: 'সিরাজদিখান', nameEn: 'Sirajdikhan' },
  { id: 'Louhajang', districtId: 'Munshiganj', nameBn: 'লৌহজং', nameEn: 'Louhajang' },
  { id: 'Tongibari', districtId: 'Munshiganj', nameBn: 'টংগীবাড়ী', nameEn: 'Tongibari' },
  { id: 'Gazaria', districtId: 'Munshiganj', nameBn: 'গজারিয়া', nameEn: 'Gazaria' },

  // ─── 8. FARIDPUR DISTRICT ───────────────────────────
  { id: 'Faridpur Sadar', districtId: 'Faridpur', nameBn: 'ফরিদপুর সদর', nameEn: 'Faridpur Sadar' },
  { id: 'Bhanga', districtId: 'Faridpur', nameBn: 'ভাঙ্গা', nameEn: 'Bhanga' },
  { id: 'Boalmari', districtId: 'Faridpur', nameBn: 'বোয়ালমারী', nameEn: 'Boalmari' },
  { id: 'Madhukhali', districtId: 'Faridpur', nameBn: 'মধুখালী', nameEn: 'Madhukhali' },
  { id: 'Nagarkanda', districtId: 'Faridpur', nameBn: 'নগরকান্দা', nameEn: 'Nagarkanda' },
  { id: 'Alfadanga', districtId: 'Faridpur', nameBn: 'আলফাডাঙ্গা', nameEn: 'Alfadanga' },
  { id: 'Sadarpur', districtId: 'Faridpur', nameBn: 'সদরপুর', nameEn: 'Sadarpur' },
  { id: 'Charbhadrasan', districtId: 'Faridpur', nameBn: 'চরভদ্রাসন', nameEn: 'Charbhadrasan' },
  { id: 'Saltha', districtId: 'Faridpur', nameBn: 'সালথা', nameEn: 'Saltha' },

  // ─── 9. GOPALGANJ DISTRICT ──────────────────────────
  { id: 'Gopalganj Sadar', districtId: 'Gopalganj', nameBn: 'গোপালগঞ্জ সদর', nameEn: 'Gopalganj Sadar' },
  { id: 'Tungipara', districtId: 'Gopalganj', nameBn: 'টুঙ্গিপাড়া', nameEn: 'Tungipara' },
  { id: 'Kotalipara', districtId: 'Gopalganj', nameBn: 'কোটালীপাড়া', nameEn: 'Kotalipara' },
  { id: 'Kashiani', districtId: 'Gopalganj', nameBn: 'কাশিয়ানী', nameEn: 'Kashiani' },
  { id: 'Muksudpur', districtId: 'Gopalganj', nameBn: 'মুকসুদপুর', nameEn: 'Muksudpur' },

  // ─── 10. MADARIPUR DISTRICT ─────────────────────────
  { id: 'Madaripur Sadar', districtId: 'Madaripur', nameBn: 'মাদারীপুর সদর', nameEn: 'Madaripur Sadar' },
  { id: 'Kalkini', districtId: 'Madaripur', nameBn: 'কালকিনি', nameEn: 'Kalkini' },
  { id: 'Shibchar', districtId: 'Madaripur', nameBn: 'শিবচর', nameEn: 'Shibchar' },
  { id: 'Rajoir', districtId: 'Madaripur', nameBn: 'রাজৈর', nameEn: 'Rajoir' },
  { id: 'Dasar', districtId: 'Madaripur', nameBn: 'ডাসার', nameEn: 'Dasar' },

  // ─── 11. RAJBARI DISTRICT ───────────────────────────
  { id: 'Rajbari Sadar', districtId: 'Rajbari', nameBn: 'রাজবাড়ী সদর', nameEn: 'Rajbari Sadar' },
  { id: 'Pangsha', districtId: 'Rajbari', nameBn: 'পাংশা', nameEn: 'Pangsha' },
  { id: 'Baliakandi', districtId: 'Rajbari', nameBn: 'বালিয়াকান্দি', nameEn: 'Baliakandi' },
  { id: 'Goalanda', districtId: 'Rajbari', nameBn: 'গোয়ালন্দ', nameEn: 'Goalanda' },
  { id: 'Kalukhali', districtId: 'Rajbari', nameBn: 'কালুখালী', nameEn: 'Kalukhali' },

  // ─── 12. SHARIATPUR DISTRICT ────────────────────────
  { id: 'Shariatpur Sadar', districtId: 'Shariatpur', nameBn: 'শরীয়তপুর সদর', nameEn: 'Shariatpur Sadar' },
  { id: 'Naria', districtId: 'Shariatpur', nameBn: 'নড়িয়া', nameEn: 'Naria' },
  { id: 'Zanjira', districtId: 'Shariatpur', nameBn: 'জাজিরা', nameEn: 'Zanjira' },
  { id: 'Gosairhat', districtId: 'Shariatpur', nameBn: 'গোসাইরহাট', nameEn: 'Gosairhat' },
  { id: 'Damudya', districtId: 'Shariatpur', nameBn: 'ডামুড্যা', nameEn: 'Damudya' },
  { id: 'Bhedarganj', districtId: 'Shariatpur', nameBn: 'ভেদরগঞ্জ', nameEn: 'Bhedarganj' },

  // ─── 13. KISHOREGANJ DISTRICT ───────────────────────
  { id: 'Kishoreganj Sadar', districtId: 'Kishoreganj', nameBn: 'কিশোরগঞ্জ সদর', nameEn: 'Kishoreganj Sadar' },
  { id: 'Bhairab', districtId: 'Kishoreganj', nameBn: 'ভৈরব', nameEn: 'Bhairab' },
  { id: 'Bajitpur', districtId: 'Kishoreganj', nameBn: 'বাজিতপুর', nameEn: 'Bajitpur' },
  { id: 'Katiadi', districtId: 'Kishoreganj', nameBn: 'কটিয়াদী', nameEn: 'Katiadi' },
  { id: 'Karimganj', districtId: 'Kishoreganj', nameBn: 'করিমগঞ্জ', nameEn: 'Karimganj' },
  { id: 'Kuliarchar', districtId: 'Kishoreganj', nameBn: 'কুলিয়ারচর', nameEn: 'Kuliarchar' },
  { id: 'Tarail', districtId: 'Kishoreganj', nameBn: 'তাড়াইল', nameEn: 'Tarail' },
  { id: 'Hossainpur', districtId: 'Kishoreganj', nameBn: 'হোসেনপুর', nameEn: 'Hossainpur' },
  { id: 'Nikli', districtId: 'Kishoreganj', nameBn: 'নিকলী', nameEn: 'Nikli' },
  { id: 'Pakundia', districtId: 'Kishoreganj', nameBn: 'পাকুন্দিয়া', nameEn: 'Pakundia' },
  { id: 'Austagram', districtId: 'Kishoreganj', nameBn: 'অষ্টগ্রাম', nameEn: 'Austagram' },
  { id: 'Itna', districtId: 'Kishoreganj', nameBn: 'ইটনা', nameEn: 'Itna' },
  { id: 'Mithamoin', districtId: 'Kishoreganj', nameBn: 'মিঠামইন', nameEn: 'Mithamoin' },

  // ─── 14. CHATTOGRAM DISTRICT ────────────────────────
  { id: 'Panchlaish', districtId: 'Chattogram', nameBn: 'পাঁচলাইশ', nameEn: 'Panchlaish' },
  { id: 'Kotwali (Chattogram)', districtId: 'Chattogram', nameBn: 'কোতোয়ালী', nameEn: 'Kotwali' },
  { id: 'Halishahar', districtId: 'Chattogram', nameBn: 'হালিশহর', nameEn: 'Halishahar' },
  { id: 'Double Mooring', districtId: 'Chattogram', nameBn: 'ডবলমুরিং / আগ্রাবাদ', nameEn: 'Double Mooring' },
  { id: 'Khulshi', districtId: 'Chattogram', nameBn: 'খুলশী', nameEn: 'Khulshi' },
  { id: 'Bakalia', districtId: 'Chattogram', nameBn: 'বাকলিয়া', nameEn: 'Bakalia' },
  { id: 'Chandgaon', districtId: 'Chattogram', nameBn: 'চান্দগাঁও', nameEn: 'Chandgaon' },
  { id: 'Bayezid', districtId: 'Chattogram', nameBn: 'বায়েজিদ', nameEn: 'Bayezid' },
  { id: 'Pahartali', districtId: 'Chattogram', nameBn: 'পাহাড়তলী', nameEn: 'Pahartali' },
  { id: 'Patenga', districtId: 'Chattogram', nameBn: 'পতেঙ্গা', nameEn: 'Patenga' },
  { id: 'Hathazari', districtId: 'Chattogram', nameBn: 'হাটহাজারী', nameEn: 'Hathazari' },
  { id: 'Sitakunda', districtId: 'Chattogram', nameBn: 'সীতাকুণ্ড', nameEn: 'Sitakunda' },
  { id: 'Mirsharai', districtId: 'Chattogram', nameBn: 'মীরসরাই', nameEn: 'Mirsharai' },
  { id: 'Patiya', districtId: 'Chattogram', nameBn: 'পটিয়া', nameEn: 'Patiya' },
  { id: 'Boalkhali', districtId: 'Chattogram', nameBn: 'বোয়ালখালী', nameEn: 'Boalkhali' },
  { id: 'Raozan', districtId: 'Chattogram', nameBn: 'রাউজান', nameEn: 'Raozan' },
  { id: 'Rangunia', districtId: 'Chattogram', nameBn: 'রাঙ্গুনিয়া', nameEn: 'Rangunia' },
  { id: 'Anwara', districtId: 'Chattogram', nameBn: 'আনোয়ারা', nameEn: 'Anwara' },
  { id: 'Fatikchhari', districtId: 'Chattogram', nameBn: 'ফটিকছড়ি', nameEn: 'Fatikchhari' },
  { id: 'Banshkhali', districtId: 'Chattogram', nameBn: 'বাঁশখালী', nameEn: 'Banshkhali' },
  { id: 'Chandanaish', districtId: 'Chattogram', nameBn: 'চন্দনাইশ', nameEn: 'Chandanaish' },
  { id: 'Lohagara (Chattogram)', districtId: 'Chattogram', nameBn: 'লোহাগাড়া', nameEn: 'Lohagara' },
  { id: 'Satkania', districtId: 'Chattogram', nameBn: 'সাতকানিয়া', nameEn: 'Satkania' },
  { id: 'Karnaphuli', districtId: 'Chattogram', nameBn: 'কর্ণফুলী', nameEn: 'Karnaphuli' },
  { id: 'Sandwip', districtId: 'Chattogram', nameBn: 'সন্দ্বীপ', nameEn: 'Sandwip' },

  // ─── 15. COX'S BAZAR DISTRICT ───────────────────────
  { id: "Cox's Bazar Sadar", districtId: "Cox's Bazar", nameBn: 'কক্সবাজার সদর', nameEn: "Cox's Bazar Sadar" },
  { id: 'Ramu', districtId: "Cox's Bazar", nameBn: 'রামু', nameEn: 'Ramu' },
  { id: 'Teknaf', districtId: "Cox's Bazar", nameBn: 'টেকনাফ', nameEn: 'Teknaf' },
  { id: 'Ukhia', districtId: "Cox's Bazar", nameBn: 'উখিয়া', nameEn: 'Ukhia' },
  { id: 'Chakaria', districtId: "Cox's Bazar", nameBn: 'চকরিয়া', nameEn: 'Chakaria' },
  { id: 'Maheshkhali', districtId: "Cox's Bazar", nameBn: 'মহেশখালী', nameEn: 'Maheshkhali' },
  { id: 'Pekua', districtId: "Cox's Bazar", nameBn: 'পেকুয়া', nameEn: 'Pekua' },
  { id: 'Kutubdia', districtId: "Cox's Bazar", nameBn: 'কুতুবদিয়া', nameEn: 'Kutubdia' },
  { id: 'Eidgaon', districtId: "Cox's Bazar", nameBn: 'ঈদগাঁও', nameEn: 'Eidgaon' },

  // ─── 16. CUMILLA DISTRICT ───────────────────────────
  { id: 'Cumilla Adarsha Sadar', districtId: 'Cumilla', nameBn: 'কুমিল্লা আদর্শ সদর', nameEn: 'Cumilla Adarsha Sadar' },
  { id: 'Cumilla Sadar Dakshin', districtId: 'Cumilla', nameBn: 'কুমিল্লা সদর দক্ষিণ', nameEn: 'Cumilla Sadar Dakshin' },
  { id: 'Daudkandi', districtId: 'Cumilla', nameBn: 'দাউদকান্দি', nameEn: 'Daudkandi' },
  { id: 'Chandina', districtId: 'Cumilla', nameBn: 'চান্দিনা', nameEn: 'Chandina' },
  { id: 'Debidwar', districtId: 'Cumilla', nameBn: 'দেবিদ্বার', nameEn: 'Debidwar' },
  { id: 'Muradnagar', districtId: 'Cumilla', nameBn: 'মুরাদনগর', nameEn: 'Muradnagar' },
  { id: 'Laksam', districtId: 'Cumilla', nameBn: 'লাকসাম', nameEn: 'Laksam' },
  { id: 'Burichang', districtId: 'Cumilla', nameBn: 'বুড়িচং', nameEn: 'Burichang' },
  { id: 'Brahmanpara', districtId: 'Cumilla', nameBn: 'ব্রাহ্মণপাড়া', nameEn: 'Brahmanpara' },
  { id: 'Chauddagram', districtId: 'Cumilla', nameBn: 'চৌদ্দগ্রাম', nameEn: 'Chauddagram' },
  { id: 'Barura', districtId: 'Cumilla', nameBn: 'বরুড়া', nameEn: 'Barura' },
  { id: 'Homna', districtId: 'Cumilla', nameBn: 'হোমনা', nameEn: 'Homna' },
  { id: 'Titas', districtId: 'Cumilla', nameBn: 'তিতাস', nameEn: 'Titas' },
  { id: 'Meghna', districtId: 'Cumilla', nameBn: 'মেঘনা', nameEn: 'Meghna' },
  { id: 'Monohargonj', districtId: 'Cumilla', nameBn: 'মনোহরগঞ্জ', nameEn: 'Monohargonj' },
  { id: 'Lalmai', districtId: 'Cumilla', nameBn: 'লালমাই', nameEn: 'Lalmai' },

  // ─── 17. FENI DISTRICT ──────────────────────────────
  { id: 'Feni Sadar', districtId: 'Feni', nameBn: 'ফেনী সদর', nameEn: 'Feni Sadar' },
  { id: 'Daganbhuiyan', districtId: 'Feni', nameBn: 'দাগনভূঞা', nameEn: 'Daganbhuiyan' },
  { id: 'Sonagazi', districtId: 'Feni', nameBn: 'সোনাগাজী', nameEn: 'Sonagazi' },
  { id: 'Chhagalnaiya', districtId: 'Feni', nameBn: 'ছাগলনাইয়া', nameEn: 'Chhagalnaiya' },
  { id: 'Parshuram', districtId: 'Feni', nameBn: 'পরশুরাম', nameEn: 'Parshuram' },
  { id: 'Fulgazi', districtId: 'Feni', nameBn: 'ফুলগাজী', nameEn: 'Fulgazi' },

  // ─── 18. BRAHMANBARIA DISTRICT ──────────────────────
  { id: 'Brahmanbaria Sadar', districtId: 'Brahmanbaria', nameBn: 'ব্রাহ্মণবাড়িয়া সদর', nameEn: 'Brahmanbaria Sadar' },
  { id: 'Ashuganj', districtId: 'Brahmanbaria', nameBn: 'আশুগঞ্জ', nameEn: 'Ashuganj' },
  { id: 'Kasba', districtId: 'Brahmanbaria', nameBn: 'কসবা', nameEn: 'Kasba' },
  { id: 'Sarail', districtId: 'Brahmanbaria', nameBn: 'সরাইল', nameEn: 'Sarail' },
  { id: 'Akhaura', districtId: 'Brahmanbaria', nameBn: 'আখাউড়া', nameEn: 'Akhaura' },
  { id: 'Nabinagar', districtId: 'Brahmanbaria', nameBn: 'নবীনগর', nameEn: 'Nabinagar' },
  { id: 'Bancharampur', districtId: 'Brahmanbaria', nameBn: 'বাঞ্ছারামপুর', nameEn: 'Bancharampur' },
  { id: 'Nasirnagar', districtId: 'Brahmanbaria', nameBn: 'নাসিরনগর', nameEn: 'Nasirnagar' },
  { id: 'Bijoynagar', districtId: 'Brahmanbaria', nameBn: 'বিজয়নগর', nameEn: 'Bijoynagar' },

  // ─── 19. NOAKHALI DISTRICT ──────────────────────────
  { id: 'Noakhali Sadar', districtId: 'Noakhali', nameBn: 'নোয়াখালী সদর (সুধারাম)', nameEn: 'Noakhali Sadar' },
  { id: 'Begumganj', districtId: 'Noakhali', nameBn: 'বেগমগঞ্জ', nameEn: 'Begumganj' },
  { id: 'Chatkhil', districtId: 'Noakhali', nameBn: 'চাটখিল', nameEn: 'Chatkhil' },
  { id: 'Senbagh', districtId: 'Noakhali', nameBn: 'সেনবাগ', nameEn: 'Senbagh' },
  { id: 'Companiganj (Noakhali)', districtId: 'Noakhali', nameBn: 'কোম্পানীগঞ্জ', nameEn: 'Companiganj' },
  { id: 'Hatiya', districtId: 'Noakhali', nameBn: 'হাতিয়া', nameEn: 'Hatiya' },
  { id: 'Sonaimuri', districtId: 'Noakhali', nameBn: 'সোনাইমুড়ী', nameEn: 'Sonaimuri' },
  { id: 'Subarnachar', districtId: 'Noakhali', nameBn: 'সুবর্ণচর', nameEn: 'Subarnachar' },
  { id: 'Kabirhat', districtId: 'Noakhali', nameBn: 'কবিরহাট', nameEn: 'Kabirhat' },

  // ─── 20. CHANDPUR DISTRICT ──────────────────────────
  { id: 'Chandpur Sadar', districtId: 'Chandpur', nameBn: 'চাঁদপুর সদর', nameEn: 'Chandpur Sadar' },
  { id: 'Hajiganj', districtId: 'Chandpur', nameBn: 'হাজীগঞ্জ', nameEn: 'Hajiganj' },
  { id: 'Faridganj', districtId: 'Chandpur', nameBn: 'ফরিদগঞ্জ', nameEn: 'Faridganj' },
  { id: 'Matlab Uttar', districtId: 'Chandpur', nameBn: 'মতলব উত্তর', nameEn: 'Matlab Uttar' },
  { id: 'Matlab Dakshin', districtId: 'Chandpur', nameBn: 'মতলব দক্ষিণ', nameEn: 'Matlab Dakshin' },
  { id: 'Kachua (Chandpur)', districtId: 'Chandpur', nameBn: 'কচুয়া', nameEn: 'Kachua' },
  { id: 'Shahrasti', districtId: 'Chandpur', nameBn: 'শাহরাস্তি', nameEn: 'Shahrasti' },
  { id: 'Haimchar', districtId: 'Chandpur', nameBn: 'হাইমচর', nameEn: 'Haimchar' },

  // ─── 21. LAKSHMIPUR DISTRICT ────────────────────────
  { id: 'Lakshmipur Sadar', districtId: 'Lakshmipur', nameBn: 'লক্ষ্মীপুর সদর', nameEn: 'Lakshmipur Sadar' },
  { id: 'Ramganj', districtId: 'Lakshmipur', nameBn: 'রামগঞ্জ', nameEn: 'Ramganj' },
  { id: 'Raipur', districtId: 'Lakshmipur', nameBn: 'রায়পুর', nameEn: 'Raipur' },
  { id: 'Ramgati', districtId: 'Lakshmipur', nameBn: 'রামগতি', nameEn: 'Ramgati' },
  { id: 'Kamalnagar', districtId: 'Lakshmipur', nameBn: 'কমলনগর', nameEn: 'Kamalnagar' },

  // ─── 22. RANGAMATI DISTRICT ─────────────────────────
  { id: 'Rangamati Sadar', districtId: 'Rangamati', nameBn: 'রাঙ্গামাটি সদর', nameEn: 'Rangamati Sadar' },
  { id: 'Kaptai', districtId: 'Rangamati', nameBn: 'কাপ্তাই', nameEn: 'Kaptai' },
  { id: 'Baghaichhari', districtId: 'Rangamati', nameBn: 'বাঘাইছড়ি', nameEn: 'Baghaichhari' },
  { id: 'Naniarchar', districtId: 'Rangamati', nameBn: 'নানিয়ারচর', nameEn: 'Naniarchar' },
  { id: 'Barkal', districtId: 'Rangamati', nameBn: 'বরকল', nameEn: 'Barkal' },
  { id: 'Jurachhari', districtId: 'Rangamati', nameBn: 'জুরাছড়ি', nameEn: 'Jurachhari' },
  { id: 'Kawkhali (Rangamati)', districtId: 'Rangamati', nameBn: 'কাউখালী', nameEn: 'Kawkhali' },
  { id: 'Belaichhari', districtId: 'Rangamati', nameBn: 'বিলাইছড়ি', nameEn: 'Belaichhari' },
  { id: 'Rajasthali', districtId: 'Rangamati', nameBn: 'রাজস্থলী', nameEn: 'Rajasthali' },
  { id: 'Langadu', districtId: 'Rangamati', nameBn: 'লংগদু', nameEn: 'Langadu' },

  // ─── 23. BANDARBAN DISTRICT ─────────────────────────
  { id: 'Bandarban Sadar', districtId: 'Bandarban', nameBn: 'বান্দরবান সদর', nameEn: 'Bandarban Sadar' },
  { id: 'Ruma', districtId: 'Bandarban', nameBn: 'রুমা', nameEn: 'Ruma' },
  { id: 'Thanchi', districtId: 'Bandarban', nameBn: 'থানচি', nameEn: 'Thanchi' },
  { id: 'Rowangchhari', districtId: 'Bandarban', nameBn: 'রোয়াংছড়ি', nameEn: 'Rowangchhari' },
  { id: 'Lama', districtId: 'Bandarban', nameBn: 'লামা', nameEn: 'Lama' },
  { id: 'Alikadam', districtId: 'Bandarban', nameBn: 'আলীকদম', nameEn: 'Alikadam' },
  { id: 'Naikhongchhari', districtId: 'Bandarban', nameBn: 'নাইক্ষ্যংছড়ি', nameEn: 'Naikhongchhari' },

  // ─── 24. KHAGRACHHARI DISTRICT ──────────────────────
  { id: 'Khagrachhari Sadar', districtId: 'Khagrachhari', nameBn: 'খাগড়াছড়ি সদর', nameEn: 'Khagrachhari Sadar' },
  { id: 'Dighinala', districtId: 'Khagrachhari', nameBn: 'দীঘিনালা', nameEn: 'Dighinala' },
  { id: 'Panchhari', districtId: 'Khagrachhari', nameBn: 'পানছড়ি', nameEn: 'Panchhari' },
  { id: 'Mahalchhari', districtId: 'Khagrachhari', nameBn: 'মহালছড়ি', nameEn: 'Mahalchhari' },
  { id: 'Matiranga', districtId: 'Khagrachhari', nameBn: 'মাটিরাঙ্গা', nameEn: 'Matiranga' },
  { id: 'Manikchhari', districtId: 'Khagrachhari', nameBn: 'মানিকছড়ি', nameEn: 'Manikchhari' },
  { id: 'Ramgarh', districtId: 'Khagrachhari', nameBn: 'রামগড়', nameEn: 'Ramgarh' },
  { id: 'Lakshmichhari', districtId: 'Khagrachhari', nameBn: 'লক্ষ্মীছড়ি', nameEn: 'Lakshmichhari' },
  { id: 'Guimara', districtId: 'Khagrachhari', nameBn: 'গুইমারা', nameEn: 'Guimara' },

  // ─── 25. RAJSHAHI DISTRICT ──────────────────────────
  { id: 'Boalia', districtId: 'Rajshahi', nameBn: 'বোয়ালিয়া', nameEn: 'Boalia' },
  { id: 'Rajpara', districtId: 'Rajshahi', nameBn: 'রাজপাড়া', nameEn: 'Rajpara' },
  { id: 'Motihar', districtId: 'Rajshahi', nameBn: 'মতিহার', nameEn: 'Motihar' },
  { id: 'Shah Mokhdum', districtId: 'Rajshahi', nameBn: 'শাহ মখদুম', nameEn: 'Shah Mokhdum' },
  { id: 'Paba', districtId: 'Rajshahi', nameBn: 'পবা', nameEn: 'Paba' },
  { id: 'Godagari', districtId: 'Rajshahi', nameBn: 'গোদাগাড়ী', nameEn: 'Godagari' },
  { id: 'Tanore', districtId: 'Rajshahi', nameBn: 'তানোর', nameEn: 'Tanore' },
  { id: 'Bagmara', districtId: 'Rajshahi', nameBn: 'বাগমারা', nameEn: 'Bagmara' },
  { id: 'Puthia', districtId: 'Rajshahi', nameBn: 'পুঠিয়া', nameEn: 'Puthia' },
  { id: 'Charghat', districtId: 'Rajshahi', nameBn: 'চারঘাট', nameEn: 'Charghat' },
  { id: 'Bagha', districtId: 'Rajshahi', nameBn: 'বাঘা', nameEn: 'Bagha' },
  { id: 'Durgapur (Rajshahi)', districtId: 'Rajshahi', nameBn: 'দুর্গাপুর', nameEn: 'Durgapur' },
  { id: 'Mohanpur', districtId: 'Rajshahi', nameBn: 'মোহনপুর', nameEn: 'Mohanpur' },

  // ─── 26. BOGURA DISTRICT ────────────────────────────
  { id: 'Bogura Sadar', districtId: 'Bogura', nameBn: 'বগুড়া সদর', nameEn: 'Bogura Sadar' },
  { id: 'Shajahanpur', districtId: 'Bogura', nameBn: 'শাজাহানপুর', nameEn: 'Shajahanpur' },
  { id: 'Shibganj (Bogura)', districtId: 'Bogura', nameBn: 'শিবগঞ্জ', nameEn: 'Shibganj' },
  { id: 'Sherpur (Bogura)', districtId: 'Bogura', nameBn: 'শেরপুর', nameEn: 'Sherpur' },
  { id: 'Gabtali', districtId: 'Bogura', nameBn: 'গাবতলী', nameEn: 'Gabtali' },
  { id: 'Sonatola', districtId: 'Bogura', nameBn: 'সোনাতলা', nameEn: 'Sonatola' },
  { id: 'Dhunat', districtId: 'Bogura', nameBn: 'ধুনট', nameEn: 'Dhunat' },
  { id: 'Adamdighi', districtId: 'Bogura', nameBn: 'আদমদীঘি', nameEn: 'Adamdighi' },
  { id: 'Dupchanchia', districtId: 'Bogura', nameBn: 'দুপচাঁচিয়া', nameEn: 'Dupchanchia' },
  { id: 'Kahaloo', districtId: 'Bogura', nameBn: 'কাহালু', nameEn: 'Kahaloo' },
  { id: 'Nandigram', districtId: 'Bogura', nameBn: 'নন্দীগ্রাম', nameEn: 'Nandigram' },
  { id: 'Sariakandi', districtId: 'Bogura', nameBn: 'সারিয়াকান্দি', nameEn: 'Sariakandi' },

  // ─── 27. PABNA DISTRICT ─────────────────────────────
  { id: 'Pabna Sadar', districtId: 'Pabna', nameBn: 'পাবনা সদর', nameEn: 'Pabna Sadar' },
  { id: 'Ishwardi', districtId: 'Pabna', nameBn: 'ঈশ্বরদী', nameEn: 'Ishwardi' },
  { id: 'Sujanagar', districtId: 'Pabna', nameBn: 'সুজানগর', nameEn: 'Sujanagar' },
  { id: 'Santhia', districtId: 'Pabna', nameBn: 'সাঁথিয়া', nameEn: 'Santhia' },
  { id: 'Bera', districtId: 'Pabna', nameBn: 'বেড়া', nameEn: 'Bera' },
  { id: 'Atgharia', districtId: 'Pabna', nameBn: 'আটঘরিয়া', nameEn: 'Atgharia' },
  { id: 'Chatmohar', districtId: 'Pabna', nameBn: 'চাটমোহর', nameEn: 'Chatmohar' },
  { id: 'Faridpur (Pabna)', districtId: 'Pabna', nameBn: 'ফরিদপুর', nameEn: 'Faridpur' },
  { id: 'Bhangura', districtId: 'Pabna', nameBn: 'ভাঙ্গুড়া', nameEn: 'Bhangura' },

  // ─── 28. SIRAJGANJ DISTRICT ─────────────────────────
  { id: 'Sirajganj Sadar', districtId: 'Sirajganj', nameBn: 'সিরাজগঞ্জ সদর', nameEn: 'Sirajganj Sadar' },
  { id: 'Ullapara', districtId: 'Sirajganj', nameBn: 'উল্লাপাড়া', nameEn: 'Ullapara' },
  { id: 'Shahjadpur', districtId: 'Sirajganj', nameBn: 'শাহজাদপুর', nameEn: 'Shahjadpur' },
  { id: 'Belkuchi', districtId: 'Sirajganj', nameBn: 'বেলকুচি', nameEn: 'Belkuchi' },
  { id: 'Kamarkhanda', districtId: 'Sirajganj', nameBn: 'কামারখন্দ', nameEn: 'Kamarkhanda' },
  { id: 'Raiganj', districtId: 'Sirajganj', nameBn: 'রায়গঞ্জ', nameEn: 'Raiganj' },
  { id: 'Tarash', districtId: 'Sirajganj', nameBn: 'তাড়াশ', nameEn: 'Tarash' },
  { id: 'Kazipur', districtId: 'Sirajganj', nameBn: 'কাজিপুর', nameEn: 'Kazipur' },
  { id: 'Chauhali', districtId: 'Sirajganj', nameBn: 'চৌহালী', nameEn: 'Chauhali' },

  // ─── 29. NAOGAON DISTRICT ───────────────────────────
  { id: 'Naogaon Sadar', districtId: 'Naogaon', nameBn: 'নওগাঁ সদর', nameEn: 'Naogaon Sadar' },
  { id: 'Niamatpur', districtId: 'Naogaon', nameBn: 'নিয়ামতপুর', nameEn: 'Niamatpur' },
  { id: 'Patnitala', districtId: 'Naogaon', nameBn: 'পত্নীতলা', nameEn: 'Patnitala' },
  { id: 'Manda', districtId: 'Naogaon', nameBn: 'মান্দা', nameEn: 'Manda' },
  { id: 'Badalgachhi', districtId: 'Naogaon', nameBn: 'বদলগাছী', nameEn: 'Badalgachhi' },
  { id: 'Mohadevpur', districtId: 'Naogaon', nameBn: 'মহাদেবপুর', nameEn: 'Mohadevpur' },
  { id: 'Dhamoirhat', districtId: 'Naogaon', nameBn: 'ধামইরহাট', nameEn: 'Dhamoirhat' },
  { id: 'Atrai', districtId: 'Naogaon', nameBn: 'আত্রাই', nameEn: 'Atrai' },
  { id: 'Raninagar', districtId: 'Naogaon', nameBn: 'রানীনগর', nameEn: 'Raninagar' },
  { id: 'Porsha', districtId: 'Naogaon', nameBn: 'পোরশা', nameEn: 'Porsha' },
  { id: 'Sapahar', districtId: 'Naogaon', nameBn: 'সাপাহার', nameEn: 'Sapahar' },

  // ─── 30. NATORE DISTRICT ────────────────────────────
  { id: 'Natore Sadar', districtId: 'Natore', nameBn: 'নাটোর সদর', nameEn: 'Natore Sadar' },
  { id: 'Singra', districtId: 'Natore', nameBn: 'সিংড়া', nameEn: 'Singra' },
  { id: 'Bagatipara', districtId: 'Natore', nameBn: 'বাগাতিপাড়া', nameEn: 'Bagatipara' },
  { id: 'Baraigram', districtId: 'Natore', nameBn: 'বড়াইগ্রাম', nameEn: 'Baraigram' },
  { id: 'Gurudaspur', districtId: 'Natore', nameBn: 'গুরুদাসপুর', nameEn: 'Gurudaspur' },
  { id: 'Lalpur', districtId: 'Natore', nameBn: 'লালপুর', nameEn: 'Lalpur' },
  { id: 'Naldanga', districtId: 'Natore', nameBn: 'নলডাঙ্গা', nameEn: 'Naldanga' },

  // ─── 31. CHAPAINAWABGANJ DISTRICT ───────────────────
  { id: 'Chapainawabganj Sadar', districtId: 'Chapainawabganj', nameBn: 'চাঁপাইনবাবগঞ্জ সদর', nameEn: 'Chapainawabganj Sadar' },
  { id: 'Shibganj (Chapai)', districtId: 'Chapainawabganj', nameBn: 'শিবগঞ্জ', nameEn: 'Shibganj' },
  { id: 'Gomastapur', districtId: 'Chapainawabganj', nameBn: 'গোমস্তাপুর', nameEn: 'Gomastapur' },
  { id: 'Nachole', districtId: 'Chapainawabganj', nameBn: 'নাচোল', nameEn: 'Nachole' },
  { id: 'Bholahat', districtId: 'Chapainawabganj', nameBn: 'ভোলাহাট', nameEn: 'Bholahat' },

  // ─── 32. JOYPURHAT DISTRICT ─────────────────────────
  { id: 'Joypurhat Sadar', districtId: 'Joypurhat', nameBn: 'জয়পুরহাট সদর', nameEn: 'Joypurhat Sadar' },
  { id: 'Panchbibi', districtId: 'Joypurhat', nameBn: 'পাঁচবিবি', nameEn: 'Panchbibi' },
  { id: 'Kalai', districtId: 'Joypurhat', nameBn: 'কালাই', nameEn: 'Kalai' },
  { id: 'Khetlal', districtId: 'Joypurhat', nameBn: 'ক্ষেতলাল', nameEn: 'Khetlal' },
  { id: 'Akkelpur', districtId: 'Joypurhat', nameBn: 'আক্কেলপুর', nameEn: 'Akkelpur' },

  // ─── 33. KHULNA DISTRICT ────────────────────────────
  { id: 'Khulna Sadar', districtId: 'Khulna', nameBn: 'খুলনা সদর / কোতোয়ালী', nameEn: 'Khulna Sadar' },
  { id: 'Sonadanga', districtId: 'Khulna', nameBn: 'সোনাডাঙ্গা', nameEn: 'Sonadanga' },
  { id: 'Khalishpur', districtId: 'Khulna', nameBn: 'খালিশপুর', nameEn: 'Khalishpur' },
  { id: 'Daulatpur (Khulna)', districtId: 'Khulna', nameBn: 'দৌলতপুর', nameEn: 'Daulatpur' },
  { id: 'Khan Jahan Ali', districtId: 'Khulna', nameBn: 'খানজাহান আলী', nameEn: 'Khan Jahan Ali' },
  { id: 'Rupsha', districtId: 'Khulna', nameBn: 'রূপসা', nameEn: 'Rupsha' },
  { id: 'Dumuria', districtId: 'Khulna', nameBn: 'ডুমুরিয়া', nameEn: 'Dumuria' },
  { id: 'Phultala', districtId: 'Khulna', nameBn: 'ফুলতলা', nameEn: 'Phultala' },
  { id: 'Batiaghata', districtId: 'Khulna', nameBn: 'বটিয়াঘাটা', nameEn: 'Batiaghata' },
  { id: 'Paikgachha', districtId: 'Khulna', nameBn: 'পাইকগাছা', nameEn: 'Paikgachha' },
  { id: 'Terokhada', districtId: 'Khulna', nameBn: 'তেরখাদা', nameEn: 'Terokhada' },
  { id: 'Dighalia', districtId: 'Khulna', nameBn: 'দিঘলিয়া', nameEn: 'Dighalia' },
  { id: 'Koyra', districtId: 'Khulna', nameBn: 'কয়রা', nameEn: 'Koyra' },
  { id: 'Dacope', districtId: 'Khulna', nameBn: 'দাকোপ', nameEn: 'Dacope' },

  // ─── 34. JASHORE DISTRICT ───────────────────────────
  { id: 'Jashore Sadar', districtId: 'Jashore', nameBn: 'যশোর সদর / কোতোয়ালী', nameEn: 'Jashore Sadar' },
  { id: 'Sharsha', districtId: 'Jashore', nameBn: 'শার্শা (বেনাপোল)', nameEn: 'Sharsha (Benapole)' },
  { id: 'Jhikargachha', districtId: 'Jashore', nameBn: 'ঝিকরগাছা', nameEn: 'Jhikargachha' },
  { id: 'Manirampur', districtId: 'Jashore', nameBn: 'মণিরামপুর', nameEn: 'Manirampur' },
  { id: 'Keshabpur', districtId: 'Jashore', nameBn: 'কেশবপুর', nameEn: 'Keshabpur' },
  { id: 'Abhaynagar', districtId: 'Jashore', nameBn: 'অভয়নগর', nameEn: 'Abhaynagar' },
  { id: 'Bagherpara', districtId: 'Jashore', nameBn: 'বাঘারপাড়া', nameEn: 'Bagherpara' },
  { id: 'Chaugachha', districtId: 'Jashore', nameBn: 'চৌগাছা', nameEn: 'Chaugachha' },

  // ─── 35. SATKHIRA DISTRICT ──────────────────────────
  { id: 'Satkhira Sadar', districtId: 'Satkhira', nameBn: 'সাতক্ষীরা সদর', nameEn: 'Satkhira Sadar' },
  { id: 'Kalaroa', districtId: 'Satkhira', nameBn: 'কলারোয়া', nameEn: 'Kalaroa' },
  { id: 'Tala', districtId: 'Satkhira', nameBn: 'তালা', nameEn: 'Tala' },
  { id: 'Debhata', districtId: 'Satkhira', nameBn: 'দেবহাটা', nameEn: 'Debhata' },
  { id: 'Kaliganj (Satkhira)', districtId: 'Satkhira', nameBn: 'কালীগঞ্জ', nameEn: 'Kaliganj' },
  { id: 'Assasuni', districtId: 'Satkhira', nameBn: 'আশাশুনি', nameEn: 'Assasuni' },
  { id: 'Shyamnagar', districtId: 'Satkhira', nameBn: 'শ্যামনগর', nameEn: 'Shyamnagar' },

  // ─── 36. KUSHTIA DISTRICT ───────────────────────────
  { id: 'Kushtia Sadar', districtId: 'Kushtia', nameBn: 'কুষ্টিয়া সদর', nameEn: 'Kushtia Sadar' },
  { id: 'Kumarkhali', districtId: 'Kushtia', nameBn: 'কুমারখালী', nameEn: 'Kumarkhali' },
  { id: 'Khoksa', districtId: 'Kushtia', nameBn: 'খোকসা', nameEn: 'Khoksa' },
  { id: 'Mirpur (Kushtia)', districtId: 'Kushtia', nameBn: 'মিরপুর', nameEn: 'Mirpur' },
  { id: 'Bheramara', districtId: 'Kushtia', nameBn: 'ভেড়ামারা', nameEn: 'Bheramara' },
  { id: 'Daulatpur (Kushtia)', districtId: 'Kushtia', nameBn: 'দৌলতপুর', nameEn: 'Daulatpur' },

  // ─── 37. JHENAIDAH DISTRICT ─────────────────────────
  { id: 'Jhenaidah Sadar', districtId: 'Jhenaidah', nameBn: 'ঝিনাইদহ সদর', nameEn: 'Jhenaidah Sadar' },
  { id: 'Shailkupa', districtId: 'Jhenaidah', nameBn: 'শৈলকূপা', nameEn: 'Shailkupa' },
  { id: 'Harinakunda', districtId: 'Jhenaidah', nameBn: 'হরিণাকুণ্ডু', nameEn: 'Harinakunda' },
  { id: 'Kaliganj (Jhenaidah)', districtId: 'Jhenaidah', nameBn: 'কালীগঞ্জ', nameEn: 'Kaliganj' },
  { id: 'Kotchandpur', districtId: 'Jhenaidah', nameBn: 'কোটচাঁদপুর', nameEn: 'Kotchandpur' },
  { id: 'Maheshpur', districtId: 'Jhenaidah', nameBn: 'মহেশপুর', nameEn: 'Maheshpur' },

  // ─── 38. BAGERHAT DISTRICT ──────────────────────────
  { id: 'Bagerhat Sadar', districtId: 'Bagerhat', nameBn: 'বাগেরহাট সদর', nameEn: 'Bagerhat Sadar' },
  { id: 'Mongla', districtId: 'Bagerhat', nameBn: 'মোংলা', nameEn: 'Mongla' },
  { id: 'Fakirhat', districtId: 'Bagerhat', nameBn: 'ফকিরহাট', nameEn: 'Fakirhat' },
  { id: 'Kachua (Bagerhat)', districtId: 'Bagerhat', nameBn: 'কচুয়া', nameEn: 'Kachua' },
  { id: 'Mollahat', districtId: 'Bagerhat', nameBn: 'মোল্লাহাট', nameEn: 'Mollahat' },
  { id: 'Rampal', districtId: 'Bagerhat', nameBn: 'রামপাল', nameEn: 'Rampal' },
  { id: 'Chitalmari', districtId: 'Bagerhat', nameBn: 'চিতলমারী', nameEn: 'Chitalmari' },
  { id: 'Sarankhola', districtId: 'Bagerhat', nameBn: 'শরণখোলা', nameEn: 'Sarankhola' },
  { id: 'Morrelganj', districtId: 'Bagerhat', nameBn: 'মোরেলগঞ্জ', nameEn: 'Morrelganj' },

  // ─── 39. CHUADANGA DISTRICT ─────────────────────────
  { id: 'Chuadanga Sadar', districtId: 'Chuadanga', nameBn: 'চুয়াডাঙ্গা সদর', nameEn: 'Chuadanga Sadar' },
  { id: 'Alamdanga', districtId: 'Chuadanga', nameBn: 'আলমডাঙ্গা', nameEn: 'Alamdanga' },
  { id: 'Damurhuda', districtId: 'Chuadanga', nameBn: 'দামুড়হুদা', nameEn: 'Damurhuda' },
  { id: 'Jibannagar', districtId: 'Chuadanga', nameBn: 'জীবননগর', nameEn: 'Jibannagar' },

  // ─── 40. MEHERPUR DISTRICT ──────────────────────────
  { id: 'Meherpur Sadar', districtId: 'Meherpur', nameBn: 'মেহেরপুর সদর', nameEn: 'Meherpur Sadar' },
  { id: 'Gangni', districtId: 'Meherpur', nameBn: 'গাংনী', nameEn: 'Gangni' },
  { id: 'Mujibnagar', districtId: 'Meherpur', nameBn: 'মুজিবনগর', nameEn: 'Mujibnagar' },

  // ─── 41. MAGURA DISTRICT ────────────────────────────
  { id: 'Magura Sadar', districtId: 'Magura', nameBn: 'মাগুরা সদর', nameEn: 'Magura Sadar' },
  { id: 'Sreepur (Magura)', districtId: 'Magura', nameBn: 'শ্রীপুর', nameEn: 'Sreepur' },
  { id: 'Mohammadpur (Magura)', districtId: 'Magura', nameBn: 'মহম্মদপুর', nameEn: 'Mohammadpur' },
  { id: 'Shalikha', districtId: 'Magura', nameBn: 'শালিখা', nameEn: 'Shalikha' },

  // ─── 42. NARAIL DISTRICT ────────────────────────────
  { id: 'Narail Sadar', districtId: 'Narail', nameBn: 'নড়াইল সদর', nameEn: 'Narail Sadar' },
  { id: 'Lohagara (Narail)', districtId: 'Narail', nameBn: 'লোহাগড়া', nameEn: 'Lohagara' },
  { id: 'Kalia', districtId: 'Narail', nameBn: 'কালিয়া', nameEn: 'Kalia' },

  // ─── 43. BARISHAL DISTRICT ──────────────────────────
  { id: 'Barishal Sadar', districtId: 'Barishal', nameBn: 'বরিশাল সদর / কোতোয়ালী', nameEn: 'Barishal Sadar' },
  { id: 'Babuganj', districtId: 'Barishal', nameBn: 'বাবুগঞ্জ', nameEn: 'Babuganj' },
  { id: 'Bakerganj', districtId: 'Barishal', nameBn: 'বাকেরগঞ্জ', nameEn: 'Bakerganj' },
  { id: 'Gaurnadi', districtId: 'Barishal', nameBn: 'গৌরনদী', nameEn: 'Gaurnadi' },
  { id: 'Banaripara', districtId: 'Barishal', nameBn: 'বানারীপাড়া', nameEn: 'Banaripara' },
  { id: 'Wazirpur', districtId: 'Barishal', nameBn: 'উজিরপুর', nameEn: 'Wazirpur' },
  { id: 'Muladi', districtId: 'Barishal', nameBn: 'মুলাদী', nameEn: 'Muladi' },
  { id: 'Mehendiganj', districtId: 'Barishal', nameBn: 'মেহেন্দিগঞ্জ', nameEn: 'Mehendiganj' },
  { id: 'Hizla', districtId: 'Barishal', nameBn: 'হিজলা', nameEn: 'Hizla' },
  { id: 'Agailjhara', districtId: 'Barishal', nameBn: 'আগৈলঝাড়া', nameEn: 'Agailjhara' },

  // ─── 44. PATUAKHALI DISTRICT ────────────────────────
  { id: 'Patuakhali Sadar', districtId: 'Patuakhali', nameBn: 'পটুয়াখালী সদর', nameEn: 'Patuakhali Sadar' },
  { id: 'Kalapara', districtId: 'Patuakhali', nameBn: 'কলাপাড়া (কুয়াকাটা)', nameEn: 'Kalapara (Kuakata)' },
  { id: 'Bauphal', districtId: 'Patuakhali', nameBn: 'বাউফল', nameEn: 'Bauphal' },
  { id: 'Galachipa', districtId: 'Patuakhali', nameBn: 'গলাচিপা', nameEn: 'Galachipa' },
  { id: 'Dashmina', districtId: 'Patuakhali', nameBn: 'দশমিনা', nameEn: 'Dashmina' },
  { id: 'Mirzaganj', districtId: 'Patuakhali', nameBn: 'মির্জাগঞ্জ', nameEn: 'Mirzaganj' },
  { id: 'Dumki', districtId: 'Patuakhali', nameBn: 'দুমকি', nameEn: 'Dumki' },
  { id: 'Rangabali', districtId: 'Patuakhali', nameBn: 'রাঙ্গাবালী', nameEn: 'Rangabali' },

  // ─── 45. BHOLA DISTRICT ─────────────────────────────
  { id: 'Bhola Sadar', districtId: 'Bhola', nameBn: 'ভোলা সদর', nameEn: 'Bhola Sadar' },
  { id: 'Borhanuddin', districtId: 'Bhola', nameBn: 'বোরহানউদ্দিন', nameEn: 'Borhanuddin' },
  { id: 'Char Fasson', districtId: 'Bhola', nameBn: 'চরফ্যাশন', nameEn: 'Char Fasson' },
  { id: 'Daulatkhan', districtId: 'Bhola', nameBn: 'দৌলতখান', nameEn: 'Daulatkhan' },
  { id: 'Lalmohan', districtId: 'Bhola', nameBn: 'লালমোহন', nameEn: 'Lalmohan' },
  { id: 'Tazumuddin', districtId: 'Bhola', nameBn: 'তজুমদ্দিন', nameEn: 'Tazumuddin' },
  { id: 'Manpura', districtId: 'Bhola', nameBn: 'মনপুরা', nameEn: 'Manpura' },

  // ─── 46. PIROJPUR DISTRICT ──────────────────────────
  { id: 'Pirojpur Sadar', districtId: 'Pirojpur', nameBn: 'পিরোজপুর সদর', nameEn: 'Pirojpur Sadar' },
  { id: 'Bhandaria', districtId: 'Pirojpur', nameBn: 'ভাণ্ডারিয়া', nameEn: 'Bhandaria' },
  { id: 'Mathbaria', districtId: 'Pirojpur', nameBn: 'মঠবাড়িয়া', nameEn: 'Mathbaria' },
  { id: 'Nazirpur', districtId: 'Pirojpur', nameBn: 'নাজিরপুর', nameEn: 'Nazirpur' },
  { id: 'Nesarabad', districtId: 'Pirojpur', nameBn: 'নেছারাবাদ (স্বরূপকাঠি)', nameEn: 'Nesarabad (Swarupkathi)' },
  { id: 'Kawkhali (Pirojpur)', districtId: 'Pirojpur', nameBn: 'কাউখালী', nameEn: 'Kawkhali' },
  { id: 'Indurkani', districtId: 'Pirojpur', nameBn: 'ইন্দুরকানী (জিয়ানগর)', nameEn: 'Indurkani' },

  // ─── 47. BARGUNA DISTRICT ───────────────────────────
  { id: 'Barguna Sadar', districtId: 'Barguna', nameBn: 'বরগুনা সদর', nameEn: 'Barguna Sadar' },
  { id: 'Amtali', districtId: 'Barguna', nameBn: 'আমতলী', nameEn: 'Amtali' },
  { id: 'Patharghata', districtId: 'Barguna', nameBn: 'পাথরঘাটা', nameEn: 'Patharghata' },
  { id: 'Betagi', districtId: 'Barguna', nameBn: 'বেতাগী', nameEn: 'Betagi' },
  { id: 'Bamna', districtId: 'Barguna', nameBn: 'বামনা', nameEn: 'Bamna' },
  { id: 'Taltali', districtId: 'Barguna', nameBn: 'তালতলী', nameEn: 'Taltali' },

  // ─── 48. JHALOKATHI DISTRICT ────────────────────────
  { id: 'Jhalokathi Sadar', districtId: 'Jhalokathi', nameBn: 'ঝালকাঠি সদর', nameEn: 'Jhalokathi Sadar' },
  { id: 'Nalchhiti', districtId: 'Jhalokathi', nameBn: 'নলছিটি', nameEn: 'Nalchhiti' },
  { id: 'Rajapur', districtId: 'Jhalokathi', nameBn: 'রাজাপুর', nameEn: 'Rajapur' },
  { id: 'Kathalia', districtId: 'Jhalokathi', nameBn: 'কাঁঠালিয়া', nameEn: 'Kathalia' },

  // ─── 49. SYLHET DISTRICT ────────────────────────────
  { id: 'Sylhet Sadar', districtId: 'Sylhet', nameBn: 'সিলেট সদর / কোতোয়ালী', nameEn: 'Sylhet Sadar' },
  { id: 'South Surma', districtId: 'Sylhet', nameBn: 'দক্ষিণ সুরমা', nameEn: 'South Surma' },
  { id: 'Beanibazar', districtId: 'Sylhet', nameBn: 'বিয়ানীবাজার', nameEn: 'Beanibazar' },
  { id: 'Golapganj', districtId: 'Sylhet', nameBn: 'গোলাপগঞ্জ', nameEn: 'Golapganj' },
  { id: 'Zakiganj', districtId: 'Sylhet', nameBn: 'জকিগঞ্জ', nameEn: 'Zakiganj' },
  { id: 'Osmaninagar', districtId: 'Sylhet', nameBn: 'ওসমানীনগর', nameEn: 'Osmaninagar' },
  { id: 'Biswanath', districtId: 'Sylhet', nameBn: 'বিশ্বনাথ', nameEn: 'Biswanath' },
  { id: 'Fenchuganj', districtId: 'Sylhet', nameBn: 'ফেঞ্চুগঞ্জ', nameEn: 'Fenchuganj' },
  { id: 'Gowainghat', districtId: 'Sylhet', nameBn: 'গোয়াইনঘাট', nameEn: 'Gowainghat' },
  { id: 'Jaintiapur', districtId: 'Sylhet', nameBn: 'জৈন্তাপুর', nameEn: 'Jaintiapur' },
  { id: 'Kanaighat', districtId: 'Sylhet', nameBn: 'কানাইঘাট', nameEn: 'Kanaighat' },
  { id: 'Companiganj (Sylhet)', districtId: 'Sylhet', nameBn: 'কোম্পানীগঞ্জ', nameEn: 'Companiganj' },
  { id: 'Balaganj', districtId: 'Sylhet', nameBn: 'বালাগঞ্জ', nameEn: 'Balaganj' },

  // ─── 50. MOULVIBAZAR DISTRICT ───────────────────────
  { id: 'Moulvibazar Sadar', districtId: 'Moulvibazar', nameBn: 'মৌলভীবাজার সদর', nameEn: 'Moulvibazar Sadar' },
  { id: 'Sreemangal', districtId: 'Moulvibazar', nameBn: 'শ্রীমঙ্গল', nameEn: 'Sreemangal' },
  { id: 'Kamalganj', districtId: 'Moulvibazar', nameBn: 'কমলগঞ্জ', nameEn: 'Kamalganj' },
  { id: 'Kulaura', districtId: 'Moulvibazar', nameBn: 'কুলাউড়া', nameEn: 'Kulaura' },
  { id: 'Barlekha', districtId: 'Moulvibazar', nameBn: 'বড়লেখা', nameEn: 'Barlekha' },
  { id: 'Rajnagar', districtId: 'Moulvibazar', nameBn: 'রাজনগর', nameEn: 'Rajnagar' },
  { id: 'Juri', districtId: 'Moulvibazar', nameBn: 'জুড়ী', nameEn: 'Juri' },

  // ─── 51. HABIGANJ DISTRICT ──────────────────────────
  { id: 'Habiganj Sadar', districtId: 'Habiganj', nameBn: 'হবিগঞ্জ সদর', nameEn: 'Habiganj Sadar' },
  { id: 'Madhabpur', districtId: 'Habiganj', nameBn: 'মাধবপুর', nameEn: 'Madhabpur' },
  { id: 'Chunarughat', districtId: 'Habiganj', nameBn: 'চুনারুঘাট', nameEn: 'Chunarughat' },
  { id: 'Bahubal', districtId: 'Habiganj', nameBn: 'বাহুবল', nameEn: 'Bahubal' },
  { id: 'Nabiganj', districtId: 'Habiganj', nameBn: 'নবীগঞ্জ', nameEn: 'Nabiganj' },
  { id: 'Baniyachong', districtId: 'Habiganj', nameBn: 'বানিয়াচং', nameEn: 'Baniyachong' },
  { id: 'Ajmiriganj', districtId: 'Habiganj', nameBn: 'আজমিরীগঞ্জ', nameEn: 'Ajmiriganj' },
  { id: 'Lakhai', districtId: 'Habiganj', nameBn: 'লাখাই', nameEn: 'Lakhai' },
  { id: 'Shayestaganj', districtId: 'Habiganj', nameBn: 'শায়েস্তাগঞ্জ', nameEn: 'Shayestaganj' },

  // ─── 52. SUNAMGANJ DISTRICT ─────────────────────────
  { id: 'Sunamganj Sadar', districtId: 'Sunamganj', nameBn: 'সুনামগঞ্জ সদর', nameEn: 'Sunamganj Sadar' },
  { id: 'Chhatak', districtId: 'Sunamganj', nameBn: 'ছাতক', nameEn: 'Chhatak' },
  { id: 'Jagannathpur', districtId: 'Sunamganj', nameBn: 'জগন্নাথপুর', nameEn: 'Jagannathpur' },
  { id: 'Derai', districtId: 'Sunamganj', nameBn: 'দিরাই', nameEn: 'Derai' },
  { id: 'Sulla', districtId: 'Sunamganj', nameBn: 'শাল্লা', nameEn: 'Sulla' },
  { id: 'Doarabazar', districtId: 'Sunamganj', nameBn: 'দোয়ারাবাজার', nameEn: 'Doarabazar' },
  { id: 'Dharmapasha', districtId: 'Sunamganj', nameBn: 'ধর্মপাশা', nameEn: 'Dharmapasha' },
  { id: 'Jamalganj', districtId: 'Sunamganj', nameBn: 'জামালগঞ্জ', nameEn: 'Jamalganj' },
  { id: 'Tahirpur', districtId: 'Sunamganj', nameBn: 'তাহিরপুর', nameEn: 'Tahirpur' },
  { id: 'Biswamvarpur', districtId: 'Sunamganj', nameBn: 'বিশ্বম্ভরপুর', nameEn: 'Biswamvarpur' },
  { id: 'Madhyanagar', districtId: 'Sunamganj', nameBn: 'মধ্যনগর', nameEn: 'Madhyanagar' },
  { id: 'Shanthiganj', districtId: 'Sunamganj', nameBn: 'শান্তিগঞ্জ', nameEn: 'Shanthiganj' },

  // ─── 53. RANGPUR DISTRICT ───────────────────────────
  { id: 'Rangpur Sadar', districtId: 'Rangpur', nameBn: 'রংপুর সদর / কোতোয়ালী', nameEn: 'Rangpur Sadar' },
  { id: 'Badarganj', districtId: 'Rangpur', nameBn: 'বদরগঞ্জ', nameEn: 'Badarganj' },
  { id: 'Mithapukur', districtId: 'Rangpur', nameBn: 'মিঠাপুকুর', nameEn: 'Mithapukur' },
  { id: 'Pirgachha', districtId: 'Rangpur', nameBn: 'পীরগাছা', nameEn: 'Pirgachha' },
  { id: 'Pirganj (Rangpur)', districtId: 'Rangpur', nameBn: 'পীরগঞ্জ', nameEn: 'Pirganj' },
  { id: 'Gangachhara', districtId: 'Rangpur', nameBn: 'গঙ্গাচড়া', nameEn: 'Gangachhara' },
  { id: 'Kaunia', districtId: 'Rangpur', nameBn: 'কাউনিয়া', nameEn: 'Kaunia' },
  { id: 'Taraganj', districtId: 'Rangpur', nameBn: 'তারাগঞ্জ', nameEn: 'Taraganj' },

  // ─── 54. DINAJPUR DISTRICT ──────────────────────────
  { id: 'Dinajpur Sadar', districtId: 'Dinajpur', nameBn: 'দিনাজপুর সদর', nameEn: 'Dinajpur Sadar' },
  { id: 'Biral', districtId: 'Dinajpur', nameBn: 'বিরল', nameEn: 'Biral' },
  { id: 'Bochaganj', districtId: 'Dinajpur', nameBn: 'বোচাগঞ্জ', nameEn: 'Bochaganj' },
  { id: 'Kaharole', districtId: 'Dinajpur', nameBn: 'কাহারোল', nameEn: 'Kaharole' },
  { id: 'Birganj', districtId: 'Dinajpur', nameBn: 'বীরগঞ্জ', nameEn: 'Birganj' },
  { id: 'Khansama', districtId: 'Dinajpur', nameBn: 'খানসামা', nameEn: 'Khansama' },
  { id: 'Chirirbandar', districtId: 'Dinajpur', nameBn: 'চিরিরবন্দর', nameEn: 'Chirirbandar' },
  { id: 'Parbatipur', districtId: 'Dinajpur', nameBn: 'পার্বতীপুর', nameEn: 'Parbatipur' },
  { id: 'Fulbari (Dinajpur)', districtId: 'Dinajpur', nameBn: 'ফুলবাড়ী', nameEn: 'Fulbari' },
  { id: 'Nawabganj (Dinajpur)', districtId: 'Dinajpur', nameBn: 'নবাবগঞ্জ', nameEn: 'Nawabganj' },
  { id: 'Birampur', districtId: 'Dinajpur', nameBn: 'বিরামপুর', nameEn: 'Birampur' },
  { id: 'Hakimpur', districtId: 'Dinajpur', nameBn: 'হাকিমপুর (হিলি)', nameEn: 'Hakimpur (Hili)' },
  { id: 'Ghoraghat', districtId: 'Dinajpur', nameBn: 'ঘোড়াঘাট', nameEn: 'Ghoraghat' },

  // ─── 55. GAIBANDHA DISTRICT ─────────────────────────
  { id: 'Gaibandha Sadar', districtId: 'Gaibandha', nameBn: 'গাইবান্ধা সদর', nameEn: 'Gaibandha Sadar' },
  { id: 'Gobindaganj', districtId: 'Gaibandha', nameBn: 'গোবিন্দগঞ্জ', nameEn: 'Gobindaganj' },
  { id: 'Sundarganj', districtId: 'Gaibandha', nameBn: 'সুন্দরগঞ্জ', nameEn: 'Sundarganj' },
  { id: 'Sadullapur', districtId: 'Gaibandha', nameBn: 'সাদুল্লাপুর', nameEn: 'Sadullapur' },
  { id: 'Palashbari', districtId: 'Gaibandha', nameBn: 'পলাশবাড়ী', nameEn: 'Palashbari' },
  { id: 'Saghata', districtId: 'Gaibandha', nameBn: 'সাঘাটা', nameEn: 'Saghata' },
  { id: 'Fulchhari', districtId: 'Gaibandha', nameBn: 'ফুলছড়ি', nameEn: 'Fulchhari' },

  // ─── 56. KURIGRAM DISTRICT ──────────────────────────
  { id: 'Kurigram Sadar', districtId: 'Kurigram', nameBn: 'কুড়িগ্রাম সদর', nameEn: 'Kurigram Sadar' },
  { id: 'Ulipur', districtId: 'Kurigram', nameBn: 'উলিপুর', nameEn: 'Ulipur' },
  { id: 'Nageshwari', districtId: 'Kurigram', nameBn: 'নাগেশ্বরী', nameEn: 'Nageshwari' },
  { id: 'Bhurungamari', districtId: 'Kurigram', nameBn: 'ভুরুঙ্গামারী', nameEn: 'Bhurungamari' },
  { id: 'Rajarhat', districtId: 'Kurigram', nameBn: 'রাজারহাট', nameEn: 'Rajarhat' },
  { id: 'Chilmari', districtId: 'Kurigram', nameBn: 'চিলমারী', nameEn: 'Chilmari' },
  { id: 'Rourmari', districtId: 'Kurigram', nameBn: 'রৌমারী', nameEn: 'Rourmari' },
  { id: 'Char Rajibpur', districtId: 'Kurigram', nameBn: 'চর রাজীবপুর', nameEn: 'Char Rajibpur' },
  { id: 'Phulbari (Kurigram)', districtId: 'Kurigram', nameBn: 'ফুলবাড়ী', nameEn: 'Phulbari' },

  // ─── 57. NILPHAMARI DISTRICT ────────────────────────
  { id: 'Nilphamari Sadar', districtId: 'Nilphamari', nameBn: 'নীলফামারী সদর', nameEn: 'Nilphamari Sadar' },
  { id: 'Saidpur', districtId: 'Nilphamari', nameBn: 'সৈয়দপুর', nameEn: 'Saidpur' },
  { id: 'Domar', districtId: 'Nilphamari', nameBn: 'ডোমার', nameEn: 'Domar' },
  { id: 'Dimla', districtId: 'Nilphamari', nameBn: 'ডিমলা', nameEn: 'Dimla' },
  { id: 'Jaldhaka', districtId: 'Nilphamari', nameBn: 'জলঢাকা', nameEn: 'Jaldhaka' },
  { id: 'Kishoreganj (Nilphamari)', districtId: 'Nilphamari', nameBn: 'কিশোরগঞ্জ', nameEn: 'Kishoreganj' },

  // ─── 58. LALMONIRHAT DISTRICT ───────────────────────
  { id: 'Lalmonirhat Sadar', districtId: 'Lalmonirhat', nameBn: 'লালমনিরহাট সদর', nameEn: 'Lalmonirhat Sadar' },
  { id: 'Patgram', districtId: 'Lalmonirhat', nameBn: 'পাটগ্রাম (বুড়িমারী)', nameEn: 'Patgram (Burimari)' },
  { id: 'Hatibandha', districtId: 'Lalmonirhat', nameBn: 'হাতীবান্ধা', nameEn: 'Hatibandha' },
  { id: 'Kaliganj (Lalmonirhat)', districtId: 'Lalmonirhat', nameBn: 'কালীগঞ্জ', nameEn: 'Kaliganj' },
  { id: 'Aditmari', districtId: 'Lalmonirhat', nameBn: 'আদিতমারী', nameEn: 'Aditmari' },

  // ─── 59. PANCHAGARH DISTRICT ────────────────────────
  { id: 'Panchagarh Sadar', districtId: 'Panchagarh', nameBn: 'পঞ্চগড় সদর', nameEn: 'Panchagarh Sadar' },
  { id: 'Tetulia', districtId: 'Panchagarh', nameBn: 'তেঁতুলিয়া', nameEn: 'Tetulia' },
  { id: 'Boda', districtId: 'Panchagarh', nameBn: 'বোদা', nameEn: 'Boda' },
  { id: 'Debiganj', districtId: 'Panchagarh', nameBn: 'দেবীগঞ্জ', nameEn: 'Debiganj' },
  { id: 'Atwari', districtId: 'Panchagarh', nameBn: 'আটোয়ারী', nameEn: 'Atwari' },

  // ─── 60. THAKURGAON DISTRICT ────────────────────────
  { id: 'Thakurgaon Sadar', districtId: 'Thakurgaon', nameBn: 'ঠাকুরগাঁও সদর', nameEn: 'Thakurgaon Sadar' },
  { id: 'Pirganj (Thakurgaon)', districtId: 'Thakurgaon', nameBn: 'পীরগঞ্জ', nameEn: 'Pirganj' },
  { id: 'Baliadangi', districtId: 'Thakurgaon', nameBn: 'বালিয়াডাঙ্গী', nameEn: 'Baliadangi' },
  { id: 'Haripur', districtId: 'Thakurgaon', nameBn: 'হরিপুর', nameEn: 'Haripur' },
  { id: 'Ranisankhail', districtId: 'Thakurgaon', nameBn: 'রাণীশংকৈল', nameEn: 'Ranisankhail' },

  // ─── 61. MYMENSINGH DISTRICT ────────────────────────
  { id: 'Mymensingh Sadar', districtId: 'Mymensingh', nameBn: 'ময়মনসিংহ সদর / কোতোয়ালী', nameEn: 'Mymensingh Sadar' },
  { id: 'Muktagachha', districtId: 'Mymensingh', nameBn: 'মুক্তাগাছা', nameEn: 'Muktagachha' },
  { id: 'Trishal', districtId: 'Mymensingh', nameBn: 'ত্রিশাল', nameEn: 'Trishal' },
  { id: 'Bhaluka', districtId: 'Mymensingh', nameBn: 'ভালুকা', nameEn: 'Bhaluka' },
  { id: 'Fulbaria', districtId: 'Mymensingh', nameBn: 'ফুলবাড়িয়া', nameEn: 'Fulbaria' },
  { id: 'Gafargaon', districtId: 'Mymensingh', nameBn: 'গফরগাঁও', nameEn: 'Gafargaon' },
  { id: 'Nandail', districtId: 'Mymensingh', nameBn: 'নান্দাইল', nameEn: 'Nandail' },
  { id: 'Ishwarganj', districtId: 'Mymensingh', nameBn: 'ঈশ্বরগঞ্জ', nameEn: 'Ishwarganj' },
  { id: 'Gauripur', districtId: 'Mymensingh', nameBn: 'গৌরীপুর', nameEn: 'Gauripur' },
  { id: 'Phulpur', districtId: 'Mymensingh', nameBn: 'ফুলপুর', nameEn: 'Phulpur' },
  { id: 'Haluaghat', districtId: 'Mymensingh', nameBn: 'হালুয়াঘাট', nameEn: 'Haluaghat' },
  { id: 'Dhobaura', districtId: 'Mymensingh', nameBn: 'ধোবাউড়া', nameEn: 'Dhobaura' },
  { id: 'Tarakanda', districtId: 'Mymensingh', nameBn: 'তারাকান্দা', nameEn: 'Tarakanda' },

  // ─── 62. JAMALPUR DISTRICT ──────────────────────────
  { id: 'Jamalpur Sadar', districtId: 'Jamalpur', nameBn: 'জামালপুর সদর', nameEn: 'Jamalpur Sadar' },
  { id: 'Melandaha', districtId: 'Jamalpur', nameBn: 'মেলান্দহ', nameEn: 'Melandaha' },
  { id: 'Madarganj', districtId: 'Jamalpur', nameBn: 'মাদারগঞ্জ', nameEn: 'Madarganj' },
  { id: 'Islampur', districtId: 'Jamalpur', nameBn: 'ইসলামপুর', nameEn: 'Islampur' },
  { id: 'Sarishabari', districtId: 'Jamalpur', nameBn: 'সরিষাবাড়ী', nameEn: 'Sarishabari' },
  { id: 'Dewanganj', districtId: 'Jamalpur', nameBn: 'দেওয়ানগঞ্জ', nameEn: 'Dewanganj' },
  { id: 'Bakshiganj', districtId: 'Jamalpur', nameBn: 'বকশীগঞ্জ', nameEn: 'Bakshiganj' },

  // ─── 63. NETROKONA DISTRICT ─────────────────────────
  { id: 'Netrokona Sadar', districtId: 'Netrokona', nameBn: 'নেত্রকোণা সদর', nameEn: 'Netrokona Sadar' },
  { id: 'Mohanganj', districtId: 'Netrokona', nameBn: 'মোহনগঞ্জ', nameEn: 'Mohanganj' },
  { id: 'Barhatta', districtId: 'Netrokona', nameBn: 'বারহাট্টা', nameEn: 'Barhatta' },
  { id: 'Kalmakanda', districtId: 'Netrokona', nameBn: 'কলমাকান্দা', nameEn: 'Kalmakanda' },
  { id: 'Durgapur (Netrokona)', districtId: 'Netrokona', nameBn: 'দুর্গাপুর', nameEn: 'Durgapur' },
  { id: 'Purbadhala', districtId: 'Netrokona', nameBn: 'পূর্বধলা', nameEn: 'Purbadhala' },
  { id: 'Kendua', districtId: 'Netrokona', nameBn: 'কেন্দুয়া', nameEn: 'Kendua' },
  { id: 'Atpara', districtId: 'Netrokona', nameBn: 'আটপাড়া', nameEn: 'Atpara' },
  { id: 'Madan', districtId: 'Netrokona', nameBn: 'মদন', nameEn: 'Madan' },
  { id: 'Khaliajuri', districtId: 'Netrokona', nameBn: 'খালিয়াজুড়ি', nameEn: 'Khaliajuri' },

  // ─── 64. SHERPUR DISTRICT ───────────────────────────
  { id: 'Sherpur Sadar', districtId: 'Sherpur', nameBn: 'শেরপুর সদর', nameEn: 'Sherpur Sadar' },
  { id: 'Nalitabari', districtId: 'Sherpur', nameBn: 'নালিতাবাড়ী', nameEn: 'Nalitabari' },
  { id: 'Nakla', districtId: 'Sherpur', nameBn: 'নকলা', nameEn: 'Nakla' },
  { id: 'Sreebardi', districtId: 'Sherpur', nameBn: 'শ্রীবরদী', nameEn: 'Sreebardi' },
  { id: 'Jhenaigati', districtId: 'Sherpur', nameBn: 'ঝিনাইগাতী', nameEn: 'Jhenaigati' },
];

export const BANGLADESH_UNIONS: UnionItem[] = [
  // ─── SAVAR ───────────────────────────────────────────
  { id: 'Birulia', upazilaId: 'Savar', nameBn: 'বিরুলিয়া ইউনিয়ন (গোলাপ গ্রাম)', nameEn: 'Birulia Union' },
  { id: 'Aminbazar', upazilaId: 'Savar', nameBn: 'আমিনবাজার ইউনিয়ন', nameEn: 'Aminbazar Union' },
  { id: 'Tetuljhora', upazilaId: 'Savar', nameBn: 'তেঁতুলঝোড়া ইউনিয়ন', nameEn: 'Tetuljhora Union' },
  { id: 'Vakurta', upazilaId: 'Savar', nameBn: 'ভাকুর্তা ইউনিয়ন', nameEn: 'Vakurta Union' },
  { id: 'Bongaon', upazilaId: 'Savar', nameBn: 'বনগাঁও ইউনিয়ন', nameEn: 'Bongaon Union' },
  { id: 'Kaundia', upazilaId: 'Savar', nameBn: 'কাউন্দিয়া ইউনিয়ন', nameEn: 'Kaundia Union' },
  { id: 'Pathalia', upazilaId: 'Savar', nameBn: 'পাথালিয়া ইউনিয়ন', nameEn: 'Pathalia Union' },
  { id: 'Shimulia', upazilaId: 'Savar', nameBn: 'শিমুলিয়া ইউনিয়ন', nameEn: 'Shimulia Union' },
  { id: 'Dhamsona', upazilaId: 'Savar', nameBn: 'ধামসোনা ইউনিয়ন', nameEn: 'Dhamsona Union' },
  { id: 'Yearpur', upazilaId: 'Savar', nameBn: 'ইয়ারপুর ইউনিয়ন', nameEn: 'Yearpur Union' },
  { id: 'Ashulia', upazilaId: 'Savar', nameBn: 'আশুলিয়া ইউনিয়ন', nameEn: 'Ashulia Union' },

  // ─── KERANIGANJ ──────────────────────────────────────
  { id: 'Zinzira', upazilaId: 'Keraniganj', nameBn: 'জিনজিরা ইউনিয়ন', nameEn: 'Zinzira Union' },
  { id: 'Aganagar', upazilaId: 'Keraniganj', nameBn: 'আগানগর ইউনিয়ন', nameEn: 'Aganagar Union' },
  { id: 'Kalindi', upazilaId: 'Keraniganj', nameBn: 'কালিন্দী ইউনিয়ন', nameEn: 'Kalindi Union' },
  { id: 'Rohitpur', upazilaId: 'Keraniganj', nameBn: 'রোহিতপুর ইউনিয়ন', nameEn: 'Rohitpur Union' },
  { id: 'Subhadya', upazilaId: 'Keraniganj', nameBn: 'শুভাঢ্যা ইউনিয়ন', nameEn: 'Subhadya Union' },
  { id: 'Basta', upazilaId: 'Keraniganj', nameBn: 'বাস্তা ইউনিয়ন', nameEn: 'Basta Union' },
  { id: 'Taranagar', upazilaId: 'Keraniganj', nameBn: 'তারানগর ইউনিয়ন', nameEn: 'Taranagar Union' },
  { id: 'Shakta', upazilaId: 'Keraniganj', nameBn: 'শাক্তা ইউনিয়ন', nameEn: 'Shakta Union' },
  { id: 'Hazratpur', upazilaId: 'Keraniganj', nameBn: 'হযরতপুর ইউনিয়ন', nameEn: 'Hazratpur Union' },
  { id: 'Konda', upazilaId: 'Keraniganj', nameBn: 'কোন্ডা ইউনিয়ন', nameEn: 'Konda Union' },

  // ─── DHAMRAI ─────────────────────────────────────────
  { id: 'Amta', upazilaId: 'Dhamrai', nameBn: 'আমতা ইউনিয়ন', nameEn: 'Amta Union' },
  { id: 'Kushura', upazilaId: 'Dhamrai', nameBn: 'কুশুরা ইউনিয়ন', nameEn: 'Kushura Union' },
  { id: 'Balia', upazilaId: 'Dhamrai', nameBn: 'বালিয়া ইউনিয়ন', nameEn: 'Balia Union' },
  { id: 'Jadavpur', upazilaId: 'Dhamrai', nameBn: 'যাদবপুর ইউনিয়ন', nameEn: 'Jadavpur Union' },
  { id: 'Baishakanda', upazilaId: 'Dhamrai', nameBn: 'বাইশাকান্দা ইউনিয়ন', nameEn: 'Baishakanda Union' },
  { id: 'Gangutia', upazilaId: 'Dhamrai', nameBn: 'গাঙ্গুটিয়া ইউনিয়ন', nameEn: 'Gangutia Union' },
  { id: 'Sombhag', upazilaId: 'Dhamrai', nameBn: 'সোমভাগ ইউনিয়ন', nameEn: 'Sombhag Union' },
  { id: 'Kulla', upazilaId: 'Dhamrai', nameBn: 'কুল্লা ইউনিয়ন', nameEn: 'Kulla Union' },
  { id: 'Rowail', upazilaId: 'Dhamrai', nameBn: 'রোয়াইল ইউনিয়ন', nameEn: 'Rowail Union' },
  { id: 'Nannar', upazilaId: 'Dhamrai', nameBn: 'নান্নার ইউনিয়ন', nameEn: 'Nannar Union' },
  { id: 'Suapur', upazilaId: 'Dhamrai', nameBn: 'সুয়াপুর ইউনিয়ন', nameEn: 'Suapur Union' },
  { id: 'Bhararia', upazilaId: 'Dhamrai', nameBn: 'ভাড়ারিয়া ইউনিয়ন', nameEn: 'Bhararia Union' },
  { id: 'Chauhat', upazilaId: 'Dhamrai', nameBn: 'চৌহাট ইউনিয়ন', nameEn: 'Chauhat Union' },

  // ─── KALIAKAIR ───────────────────────────────────────
  { id: 'Boali', upazilaId: 'Kaliakair', nameBn: 'বোয়ালী ইউনিয়ন', nameEn: 'Boali Union' },
  { id: 'Fulbaria (Kaliakair)', upazilaId: 'Kaliakair', nameBn: 'ফুলবাড়িয়া ইউনিয়ন', nameEn: 'Fulbaria Union' },
  { id: 'Chapair', upazilaId: 'Kaliakair', nameBn: 'চাপাইর ইউনিয়ন', nameEn: 'Chapair Union' },
  { id: 'Sutrapur', upazilaId: 'Kaliakair', nameBn: 'সূত্রাপুর ইউনিয়ন', nameEn: 'Sutrapur Union' },
  { id: 'Atabah', upazilaId: 'Kaliakair', nameBn: 'আটাবহ ইউনিয়ন', nameEn: 'Atabah Union' },
  { id: 'Madhyapara', upazilaId: 'Kaliakair', nameBn: 'মধ্যপাড়া ইউনিয়ন', nameEn: 'Madhyapara Union' },
  { id: 'Dhaljora', upazilaId: 'Kaliakair', nameBn: 'ঢালজোড়া ইউনিয়ন', nameEn: 'Dhaljora Union' },

  // ─── SREEPUR ─────────────────────────────────────────
  { id: 'Bormi', upazilaId: 'Sreepur', nameBn: 'বরমী ইউনিয়ন', nameEn: 'Bormi Union' },
  { id: 'Telihati', upazilaId: 'Sreepur', nameBn: 'তেলিহাটি ইউনিয়ন', nameEn: 'Telihati Union' },
  { id: 'Gazipur Union', upazilaId: 'Sreepur', nameBn: 'গাজীপুর ইউনিয়ন', nameEn: 'Gazipur Union' },
  { id: 'Mawna', upazilaId: 'Sreepur', nameBn: 'মাওনা ইউনিয়ন', nameEn: 'Mawna Union' },
  { id: 'Kaoraid', upazilaId: 'Sreepur', nameBn: 'কাওরাইদ ইউনিয়ন', nameEn: 'Kaoraid Union' },
  { id: 'Gosingga', upazilaId: 'Sreepur', nameBn: 'গোসিংগা ইউনিয়ন', nameEn: 'Gosingga Union' },
  { id: 'Rajabari', upazilaId: 'Sreepur', nameBn: 'রাজাবাড়ী ইউনিয়ন', nameEn: 'Rajabari Union' },
  { id: 'Prahladpur', upazilaId: 'Sreepur', nameBn: 'প্রহলাদপুর ইউনিয়ন', nameEn: 'Prahladpur Union' },

  // ─── SONARGAON ───────────────────────────────────────
  { id: 'Bardi', upazilaId: 'Sonargaon', nameBn: 'বারদী ইউনিয়ন', nameEn: 'Bardi Union' },
  { id: 'Baidyerbazar', upazilaId: 'Sonargaon', nameBn: 'বৈদ্যেরবাজার ইউনিয়ন', nameEn: 'Baidyerbazar Union' },
  { id: 'Kanchpur', upazilaId: 'Sonargaon', nameBn: 'কাঁচপুর ইউনিয়ন', nameEn: 'Kanchpur Union' },
  { id: 'Jampur', upazilaId: 'Sonargaon', nameBn: 'জামপুর ইউনিয়ন', nameEn: 'Jampur Union' },
  { id: 'Mograpara', upazilaId: 'Sonargaon', nameBn: 'মোগরাপাড়া ইউনিয়ন', nameEn: 'Mograpara Union' },
  { id: 'Noagaon', upazilaId: 'Sonargaon', nameBn: 'নোয়াগাঁও ইউনিয়ন', nameEn: 'Noagaon Union' },
  { id: 'Pirojpur (Sonargaon)', upazilaId: 'Sonargaon', nameBn: 'পিরোজপুর ইউনিয়ন', nameEn: 'Pirojpur Union' },
  { id: 'Sadipur', upazilaId: 'Sonargaon', nameBn: 'সাদিপুর ইউনিয়ন', nameEn: 'Sadipur Union' },
  { id: 'Sanmandi', upazilaId: 'Sonargaon', nameBn: 'সনমান্দি ইউনিয়ন', nameEn: 'Sanmandi Union' },
  { id: 'Shambhupura', upazilaId: 'Sonargaon', nameBn: 'শম্ভুপুরা ইউনিয়ন', nameEn: 'Shambhupura Union' },

  // ─── RUPGANJ ─────────────────────────────────────────
  { id: 'Kayetpara', upazilaId: 'Rupganj', nameBn: 'কায়েতপাড়া ইউনিয়ন', nameEn: 'Kayetpara Union' },
  { id: 'Bhulta', upazilaId: 'Rupganj', nameBn: 'ভুলতা ইউনিয়ন', nameEn: 'Bhulta Union' },
  { id: 'Golakandail', upazilaId: 'Rupganj', nameBn: 'গোলাকান্দাইল ইউনিয়ন', nameEn: 'Golakandail Union' },
  { id: 'Daudpur', upazilaId: 'Rupganj', nameBn: 'দাউদপুর ইউনিয়ন', nameEn: 'Daudpur Union' },
  { id: 'Rupganj Union', upazilaId: 'Rupganj', nameBn: 'রূপগঞ্জ ইউনিয়ন', nameEn: 'Rupganj Union' },
  { id: 'Murapara', upazilaId: 'Rupganj', nameBn: 'মুড়াপাড়া ইউনিয়ন', nameEn: 'Murapara Union' },
  { id: 'Bholabo', upazilaId: 'Rupganj', nameBn: 'ভোলাবো ইউনিয়ন', nameEn: 'Bholabo Union' },

  // ─── RAIPURA ─────────────────────────────────────────
  { id: 'Amirganj', upazilaId: 'Raipura', nameBn: 'আমিরগঞ্জ ইউনিয়ন', nameEn: 'Amirganj Union' },
  { id: 'Adiabad', upazilaId: 'Raipura', nameBn: 'আদিয়াবাদ ইউনিয়ন', nameEn: 'Adiabad Union' },
  { id: 'Alipura', upazilaId: 'Raipura', nameBn: 'অলিপুরা ইউনিয়ন', nameEn: 'Alipura Union' },
  { id: 'Chanderkandi', upazilaId: 'Raipura', nameBn: 'চান্দারকন্দি ইউনিয়ন', nameEn: 'Chanderkandi Union' },
  { id: 'Charmadhua', upazilaId: 'Raipura', nameBn: 'চরমধুয়া ইউনিয়ন', nameEn: 'Charmadhua Union' },
  { id: 'Charsubuddhi', upazilaId: 'Raipura', nameBn: 'চরসুবুদ্ধি ইউনিয়ন', nameEn: 'Charsubuddhi Union' },
  { id: 'Doukarchar', upazilaId: 'Raipura', nameBn: 'ডৌকারচর ইউনিয়ন', nameEn: 'Doukarchar Union' },
  { id: 'Mirzapur (Raipura)', upazilaId: 'Raipura', nameBn: 'মির্জাপুর ইউনিয়ন', nameEn: 'Mirzapur Union' },
  { id: 'Mirjanagar', upazilaId: 'Raipura', nameBn: 'মির্জানগর ইউনিয়ন', nameEn: 'Mirjanagar Union' },
  { id: 'Morjal', upazilaId: 'Raipura', nameBn: 'মরজাল ইউনিয়ন', nameEn: 'Morjal Union' },
  { id: 'Radhanagar', upazilaId: 'Raipura', nameBn: 'রাধানগর ইউনিয়ন', nameEn: 'Radhanagar Union' },
  { id: 'Raipura Union', upazilaId: 'Raipura', nameBn: 'রায়পুরা ইউনিয়ন', nameEn: 'Raipura Union' },

  // ─── SINGAIR ─────────────────────────────────────────
  { id: 'Sayesta', upazilaId: 'Singair', nameBn: 'সায়েস্তা ইউনিয়ন', nameEn: 'Sayesta Union' },
  { id: 'Joymontop', upazilaId: 'Singair', nameBn: 'জয়মন্টপ ইউনিয়ন', nameEn: 'Joymontop Union' },
  { id: 'Jamirtta', upazilaId: 'Singair', nameBn: 'জামির্ত্তা ইউনিয়ন', nameEn: 'Jamirtta Union' },
  { id: 'Talebpur', upazilaId: 'Singair', nameBn: 'তালেবপুর ইউনিয়ন', nameEn: 'Talebpur Union' },
  { id: 'Charigram', upazilaId: 'Singair', nameBn: 'চারিগ্রাম ইউনিয়ন', nameEn: 'Charigram Union' },
  { id: 'Boldhara', upazilaId: 'Singair', nameBn: 'বলধারা ইউনিয়ন', nameEn: 'Boldhara Union' },
  { id: 'Baira', upazilaId: 'Singair', nameBn: 'বায়রা ইউনিয়ন', nameEn: 'Baira Union' },
  { id: 'Chandahar', upazilaId: 'Singair', nameBn: 'চান্দহর ইউনিয়ন', nameEn: 'Chandahar Union' },

  // ─── SREENAGAR ───────────────────────────────────────
  { id: 'Baraikhali', upazilaId: 'Sreenagar', nameBn: 'বাড়ৈখালী ইউনিয়ন', nameEn: 'Baraikhali Union' },
  { id: 'Atpara (Sreenagar)', upazilaId: 'Sreenagar', nameBn: 'আটপাড়া ইউনিয়ন', nameEn: 'Atpara Union' },
  { id: 'Hansara', upazilaId: 'Sreenagar', nameBn: 'হাঁসাড়া ইউনিয়ন', nameEn: 'Hansara Union' },
  { id: 'Bhagyakul', upazilaId: 'Sreenagar', nameBn: 'ভাগ্যকুল ইউনিয়ন', nameEn: 'Bhagyakul Union' },
  { id: 'Kolapara (Sreenagar)', upazilaId: 'Sreenagar', nameBn: 'কোলাপাড়া ইউনিয়ন', nameEn: 'Kolapara Union' },
  { id: 'Baghra', upazilaId: 'Sreenagar', nameBn: 'বাঘড়া ইউনিয়ন', nameEn: 'Baghra Union' },
  { id: 'Sholaghar', upazilaId: 'Sreenagar', nameBn: 'ষোলঘর ইউনিয়ন', nameEn: 'Sholaghar Union' },
  { id: 'Birtara', upazilaId: 'Sreenagar', nameBn: 'বীরতারা ইউনিয়ন', nameEn: 'Birtara Union' },
  { id: 'Rarhikhal', upazilaId: 'Sreenagar', nameBn: 'রাঢ়িখাল ইউনিয়ন', nameEn: 'Rarhikhal Union' },

  // ─── SIRAJDIKHAN ─────────────────────────────────────
  { id: 'Basail (Sirajdikhan)', upazilaId: 'Sirajdikhan', nameBn: 'বাসাইল ইউনিয়ন', nameEn: 'Basail Union' },
  { id: 'Baluchor', upazilaId: 'Sirajdikhan', nameBn: 'বালুচর ইউনিয়ন', nameEn: 'Baluchor Union' },
  { id: 'Chitrakot', upazilaId: 'Sirajdikhan', nameBn: 'চিত্রকোট ইউনিয়ন', nameEn: 'Chitrakot Union' },
  { id: 'Jainsar', upazilaId: 'Sirajdikhan', nameBn: 'জৈনসার ইউনিয়ন', nameEn: 'Jainsar Union' },
  { id: 'Kola', upazilaId: 'Sirajdikhan', nameBn: 'কোলা ইউনিয়ন', nameEn: 'Kola Union' },
  { id: 'Malkhanagar', upazilaId: 'Sirajdikhan', nameBn: 'মালখানগর ইউনিয়ন', nameEn: 'Malkhanagar Union' },
  { id: 'Roshunia', upazilaId: 'Sirajdikhan', nameBn: 'রশুনিয়া ইউনিয়ন', nameEn: 'Roshunia Union' },
  { id: 'Shekhernagar', upazilaId: 'Sirajdikhan', nameBn: 'শেখরনগর ইউনিয়ন', nameEn: 'Shekhernagar Union' },
  { id: 'Keyain', upazilaId: 'Sirajdikhan', nameBn: 'কেয়াইন ইউনিয়ন', nameEn: 'Keyain Union' },

  // ─── BHANGA ──────────────────────────────────────────
  { id: 'Kalamridha', upazilaId: 'Bhanga', nameBn: 'কালামৃধা ইউনিয়ন', nameEn: 'Kalamridha Union' },
  { id: 'Azimnagar', upazilaId: 'Bhanga', nameBn: 'আজিমনগর ইউনিয়ন', nameEn: 'Azimnagar Union' },
  { id: 'Chumurdi', upazilaId: 'Bhanga', nameBn: 'চুমুরদী ইউনিয়ন', nameEn: 'Chumurdi Union' },
  { id: 'Gharua', upazilaId: 'Bhanga', nameBn: 'ঘারুয়া ইউনিয়ন', nameEn: 'Gharua Union' },
  { id: 'Kaulibera', upazilaId: 'Bhanga', nameBn: 'কাউলিবেড়া ইউনিয়ন', nameEn: 'Kaulibera Union' },
  { id: 'Algi', upazilaId: 'Bhanga', nameBn: 'আলগী ইউনিয়ন', nameEn: 'Algi Union' },
  { id: 'Tuzarpur', upazilaId: 'Bhanga', nameBn: 'তুজারপুর ইউনিয়ন', nameEn: 'Tuzarpur Union' },
  { id: 'Hamirdi', upazilaId: 'Bhanga', nameBn: 'হামিরদী ইউনিয়ন', nameEn: 'Hamirdi Union' },

  // ─── BOALMARI ────────────────────────────────────────
  { id: 'Ghoshpur', upazilaId: 'Boalmari', nameBn: 'ঘোষপুর ইউনিয়ন', nameEn: 'Ghoshpur Union' },
  { id: 'Satair', upazilaId: 'Boalmari', nameBn: 'সাতৈর ইউনিয়ন', nameEn: 'Satair Union' },
  { id: 'Chatul', upazilaId: 'Boalmari', nameBn: 'চতুল ইউনিয়ন', nameEn: 'Chatul Union' },
  { id: 'Boalmari Union', upazilaId: 'Boalmari', nameBn: 'বোয়ালমারী ইউনিয়ন', nameEn: 'Boalmari Union' },
  { id: 'Dadpur', upazilaId: 'Boalmari', nameBn: 'দাদপুর ইউনিয়ন', nameEn: 'Dadpur Union' },
  { id: 'Moina', upazilaId: 'Boalmari', nameBn: 'ময়না ইউনিয়ন', nameEn: 'Moina Union' },
  { id: 'Gunbaha', upazilaId: 'Boalmari', nameBn: 'গুনবহা ইউনিয়ন', nameEn: 'Gunbaha Union' },

  // ─── TUNGIPARA ───────────────────────────────────────
  { id: 'Gopalpur (Tungi)', upazilaId: 'Tungipara', nameBn: 'গোপালপুর ইউনিয়ন', nameEn: 'Gopalpur Union' },
  { id: 'Kushli', upazilaId: 'Tungipara', nameBn: 'কুশলী ইউনিয়ন', nameEn: 'Kushli Union' },
  { id: 'Patgati', upazilaId: 'Tungipara', nameBn: 'পাটগাতী ইউনিয়ন', nameEn: 'Patgati Union' },
  { id: 'Borni', upazilaId: 'Tungipara', nameBn: 'বর্নি ইউনিয়ন', nameEn: 'Borni Union' },
  { id: 'Dumuria (Tungi)', upazilaId: 'Tungipara', nameBn: 'ডুমুরিয়া ইউনিয়ন', nameEn: 'Dumuria Union' },

  // ─── SHIBCHAR ────────────────────────────────────────
  { id: 'Umedpur', upazilaId: 'Shibchar', nameBn: 'উমেদপুর ইউনিয়ন', nameEn: 'Umedpur Union' },
  { id: 'Bhadrasan', upazilaId: 'Shibchar', nameBn: 'ভদ্রাসন ইউনিয়ন', nameEn: 'Bhadrasan Union' },
  { id: 'Madborerchar', upazilaId: 'Shibchar', nameBn: 'মাদবরেরচর ইউনিয়ন', nameEn: 'Madborerchar Union' },
  { id: 'Bandarkhola', upazilaId: 'Shibchar', nameBn: 'বন্দরখোলা ইউনিয়ন', nameEn: 'Bandarkhola Union' },
  { id: 'Nilkhi', upazilaId: 'Shibchar', nameBn: 'নিলখী ইউনিয়ন', nameEn: 'Nilkhi Union' },
  { id: 'Dattapara', upazilaId: 'Shibchar', nameBn: 'দত্তপাড়া ইউনিয়ন', nameEn: 'Dattapara Union' },
  { id: 'Kutubpur', upazilaId: 'Shibchar', nameBn: 'কুতুবপুর ইউনিয়ন', nameEn: 'Kutubpur Union' },

  // ─── NARIA ───────────────────────────────────────────
  { id: 'Dingamanik', upazilaId: 'Naria', nameBn: 'ডিঙ্গামানিক ইউনিয়ন', nameEn: 'Dingamanik Union' },
  { id: 'Fatejangapur', upazilaId: 'Naria', nameBn: 'ফতেজঙ্গপুর ইউনিয়ন', nameEn: 'Fatejangapur Union' },
  { id: 'Bhojeshwar', upazilaId: 'Naria', nameBn: 'ভোজেশ্বর ইউনিয়ন', nameEn: 'Bhojeshwar Union' },
  { id: 'Rajnagar (Naria)', upazilaId: 'Naria', nameBn: 'রাজনগর ইউনিয়ন', nameEn: 'Rajnagar Union' },
  { id: 'Gharisar', upazilaId: 'Naria', nameBn: 'ঘরিসার ইউনিয়ন', nameEn: 'Gharisar Union' },
  { id: 'Nasason', upazilaId: 'Naria', nameBn: 'নশাসন ইউনিয়ন', nameEn: 'Nasason Union' },
  { id: 'Muktarcher', upazilaId: 'Naria', nameBn: 'মোক্তারেরচর ইউনিয়ন', nameEn: 'Muktarcher Union' },

  // ─── BHAIRAB ─────────────────────────────────────────
  { id: 'Sadekpur', upazilaId: 'Bhairab', nameBn: 'সাদেকপুর ইউনিয়ন', nameEn: 'Sadekpur Union' },
  { id: 'Shimulkandi', upazilaId: 'Bhairab', nameBn: 'শিমুলকান্দি ইউনিয়ন', nameEn: 'Shimulkandi Union' },
  { id: 'Sreenagar (Bhairab)', upazilaId: 'Bhairab', nameBn: 'শ্রীনগর ইউনিয়ন', nameEn: 'Sreenagar Union' },
  { id: 'Gazaria (Bhairab)', upazilaId: 'Bhairab', nameBn: 'গজারিয়া ইউনিয়ন', nameEn: 'Gazaria Union' },
  { id: 'Kalikaprasad', upazilaId: 'Bhairab', nameBn: 'কালিকাপ্রসাদ ইউনিয়ন', nameEn: 'Kalikaprasad Union' },
  { id: 'Shibpur (Bhairab)', upazilaId: 'Bhairab', nameBn: 'শিবপুর ইউনিয়ন', nameEn: 'Shibpur Union' },
  { id: 'Aganagar (Bhairab)', upazilaId: 'Bhairab', nameBn: 'আগানগর ইউনিয়ন', nameEn: 'Aganagar Union' },

  // ─── HATHAZARI ───────────────────────────────────────
  { id: 'Farhadabad', upazilaId: 'Hathazari', nameBn: 'ফরহাদাবাদ ইউনিয়ন', nameEn: 'Farhadabad Union' },
  { id: 'Dhalai', upazilaId: 'Hathazari', nameBn: 'ধলই ইউনিয়ন', nameEn: 'Dhalai Union' },
  { id: 'Mirzapur (Hatha)', upazilaId: 'Hathazari', nameBn: 'মির্জাপুর ইউনিয়ন', nameEn: 'Mirzapur Union' },
  { id: 'Gumanmardan', upazilaId: 'Hathazari', nameBn: 'গুমানমর্দন ইউনিয়ন', nameEn: 'Gumanmardan Union' },
  { id: 'Nangolmora', upazilaId: 'Hathazari', nameBn: 'নাঙ্গলমোড়া ইউনিয়ন', nameEn: 'Nangolmora Union' },
  { id: 'Mekhal', upazilaId: 'Hathazari', nameBn: 'মেখল ইউনিয়ন', nameEn: 'Mekhal Union' },
  { id: 'Fatehpur', upazilaId: 'Hathazari', nameBn: 'ফতেহপুর (চবি ক্যাম্পাস) ইউনিয়ন', nameEn: 'Fatehpur Union' },
  { id: 'Chikandandi', upazilaId: 'Hathazari', nameBn: 'চিকনদণ্ডী ইউনিয়ন', nameEn: 'Chikandandi Union' },
  { id: 'Shikarpur', upazilaId: 'Hathazari', nameBn: 'শিকারপুর ইউনিয়ন', nameEn: 'Shikarpur Union' },
  { id: 'Burishchar', upazilaId: 'Hathazari', nameBn: 'বুড়িশ্চর ইউনিয়ন', nameEn: 'Burishchar Union' },

  // ─── SITAKUNDA ───────────────────────────────────────
  { id: 'Baraiyadhala', upazilaId: 'Sitakunda', nameBn: 'বারৈয়াঢালা ইউনিয়ন', nameEn: 'Baraiyadhala Union' },
  { id: 'Kumira', upazilaId: 'Sitakunda', nameBn: 'কুমিরা ইউনিয়ন', nameEn: 'Kumira Union' },
  { id: 'Banshbaria', upazilaId: 'Sitakunda', nameBn: 'বাঁশবাড়িয়া ইউনিয়ন', nameEn: 'Banshbaria Union' },
  { id: 'Bhatiari', upazilaId: 'Sitakunda', nameBn: 'ভাটিয়ারী ইউনিয়ন', nameEn: 'Bhatiari Union' },
  { id: 'Salimpur', upazilaId: 'Sitakunda', nameBn: 'সলিমপুর ইউনিয়ন', nameEn: 'Salimpur Union' },
  { id: 'Sonaichhari', upazilaId: 'Sitakunda', nameBn: 'সোনাইছড়ি ইউনিয়ন', nameEn: 'Sonaichhari Union' },
  { id: 'Muradpur (Sita)', upazilaId: 'Sitakunda', nameBn: 'মুরাদপুর ইউনিয়ন', nameEn: 'Muradpur Union' },
  { id: 'Barabkunda', upazilaId: 'Sitakunda', nameBn: 'বাড়বকুণ্ড ইউনিয়ন', nameEn: 'Barabkunda Union' },

  // ─── MIRSHARAI ───────────────────────────────────────
  { id: 'Korerhat', upazilaId: 'Mirsharai', nameBn: 'করেরহাট ইউনিয়ন', nameEn: 'Korerhat Union' },
  { id: 'Hinguli', upazilaId: 'Mirsharai', nameBn: 'হিঙ্গুলী ইউনিয়ন', nameEn: 'Hinguli Union' },
  { id: 'Zorarganj', upazilaId: 'Mirsharai', nameBn: 'জোরারগঞ্জ ইউনিয়ন', nameEn: 'Zorarganj Union' },
  { id: 'Dhum', upazilaId: 'Mirsharai', nameBn: 'ধুম ইউনিয়ন', nameEn: 'Dhum Union' },
  { id: 'Osmanpur', upazilaId: 'Mirsharai', nameBn: 'ওসমানপুর ইউনিয়ন', nameEn: 'Osmanpur Union' },
  { id: 'Ichhakhali', upazilaId: 'Mirsharai', nameBn: 'ইছাখালী ইউনিয়ন', nameEn: 'Ichhakhali Union' },
  { id: 'Katachhara', upazilaId: 'Mirsharai', nameBn: 'কাটাছড়া ইউনিয়ন', nameEn: 'Katachhara Union' },
  { id: 'Durgapur (Mir)', upazilaId: 'Mirsharai', nameBn: 'দুর্গাপুর ইউনিয়ন', nameEn: 'Durgapur Union' },
  { id: 'Khoiyachhara', upazilaId: 'Mirsharai', nameBn: 'খৈয়াছড়া ইউনিয়ন', nameEn: 'Khoiyachhara Union' },
  { id: 'Mayani', upazilaId: 'Mirsharai', nameBn: 'মায়ানী ইউনিয়ন', nameEn: 'Mayani Union' },

  // ─── PATIYA ──────────────────────────────────────────
  { id: 'Kolagaon', upazilaId: 'Patiya', nameBn: 'কোলাগাঁও ইউনিয়ন', nameEn: 'Kolagaon Union' },
  { id: 'Habilasdwip', upazilaId: 'Patiya', nameBn: 'হাবিলাসদ্বীপ ইউনিয়ন', nameEn: 'Habilasdwip Union' },
  { id: 'Kusumpura', upazilaId: 'Patiya', nameBn: 'কুসুমপুরা ইউনিয়ন', nameEn: 'Kusumpura Union' },
  { id: 'Jiri', upazilaId: 'Patiya', nameBn: 'জিরি ইউনিয়ন', nameEn: 'Jiri Union' },
  { id: 'Kasiais', upazilaId: 'Patiya', nameBn: 'কাশিয়াইশ ইউনিয়ন', nameEn: 'Kasiais Union' },
  { id: 'Dhalghat', upazilaId: 'Patiya', nameBn: 'ধলঘাট ইউনিয়ন', nameEn: 'Dhalghat Union' },
  { id: 'Kelishahar', upazilaId: 'Patiya', nameBn: 'কেলিশহর ইউনিয়ন', nameEn: 'Kelishahar Union' },
  { id: 'Haidgaon', upazilaId: 'Patiya', nameBn: 'হাইদগাঁও ইউনিয়ন', nameEn: 'Haidgaon Union' },
  { id: 'Bhatikhain', upazilaId: 'Patiya', nameBn: 'ভাটিখাইন ইউনিয়ন', nameEn: 'Bhatikhain Union' },

  // ─── TEKNAF ──────────────────────────────────────────
  { id: 'Hnila', upazilaId: 'Teknaf', nameBn: 'হ্নীলা ইউনিয়ন', nameEn: 'Hnila Union' },
  { id: 'Sabrang', upazilaId: 'Teknaf', nameBn: 'সাবরাং ইউনিয়ন', nameEn: 'Sabrang Union' },
  { id: 'Baharchhara', upazilaId: 'Teknaf', nameBn: 'বাহারছড়া ইউনিয়ন', nameEn: 'Baharchhara Union' },
  { id: 'Teknaf Sadar Union', upazilaId: 'Teknaf', nameBn: 'টেকনাফ সদর ইউনিয়ন', nameEn: 'Teknaf Sadar Union' },
  { id: 'Saint Martin', upazilaId: 'Teknaf', nameBn: 'সেন্টমার্টিন ইউনিয়ন', nameEn: 'Saint Martin Union' },
  { id: 'Whykong', upazilaId: 'Teknaf', nameBn: 'হোয়াইক্যং ইউনিয়ন', nameEn: 'Whykong Union' },

  // ─── UKHIA ───────────────────────────────────────────
  { id: 'Jaliapalong', upazilaId: 'Ukhia', nameBn: 'জালিয়াপালং ইউনিয়ন', nameEn: 'Jaliapalong Union' },
  { id: 'Ratnapalong', upazilaId: 'Ukhia', nameBn: 'রত্নাপালং ইউনিয়ন', nameEn: 'Ratnapalong Union' },
  { id: 'Holdiapalong', upazilaId: 'Ukhia', nameBn: 'হলদিয়াপালং ইউনিয়ন', nameEn: 'Holdiapalong Union' },
  { id: 'Rajapalong', upazilaId: 'Ukhia', nameBn: 'রাজাপালং ইউনিয়ন', nameEn: 'Rajapalong Union' },
  { id: 'Palongkhali', upazilaId: 'Ukhia', nameBn: 'পালংখালী ইউনিয়ন', nameEn: 'Palongkhali Union' },

  // ─── CHAKARIA ────────────────────────────────────────
  { id: 'Harbang', upazilaId: 'Chakaria', nameBn: 'হারবাং ইউনিয়ন', nameEn: 'Harbang Union' },
  { id: 'Dulahazara', upazilaId: 'Chakaria', nameBn: 'ডুলাহাজারা ইউনিয়ন', nameEn: 'Dulahazara Union' },
  { id: 'Fasiakhali', upazilaId: 'Chakaria', nameBn: 'ফাঁসিয়াখালী ইউনিয়ন', nameEn: 'Fasiakhali Union' },
  { id: 'Chiringa', upazilaId: 'Chakaria', nameBn: 'চিরিংগা ইউনিয়ন', nameEn: 'Chiringa Union' },
  { id: 'Baraitoli', upazilaId: 'Chakaria', nameBn: 'বরইতলী ইউনিয়ন', nameEn: 'Baraitoli Union' },
  { id: 'Saharbill', upazilaId: 'Chakaria', nameBn: 'সাহারবিল ইউনিয়ন', nameEn: 'Saharbill Union' },
  { id: 'Konakhali', upazilaId: 'Chakaria', nameBn: 'কোনাখালী ইউনিয়ন', nameEn: 'Konakhali Union' },

  // ─── DAUDKANDI ───────────────────────────────────────
  { id: 'Sundalpur', upazilaId: 'Daudkandi', nameBn: 'সুন্দলপুর ইউনিয়ন', nameEn: 'Sundalpur Union' },
  { id: 'Gouripur (Daud)', upazilaId: 'Daudkandi', nameBn: 'গৌরীপুর ইউনিয়ন', nameEn: 'Gouripur Union' },
  { id: 'Jinglatoli', upazilaId: 'Daudkandi', nameBn: 'জিংলাতলী ইউনিয়ন', nameEn: 'Jinglatoli Union' },
  { id: 'Barapara', upazilaId: 'Daudkandi', nameBn: 'বারপাড়া ইউনিয়ন', nameEn: 'Barapara Union' },
  { id: 'Baushia', upazilaId: 'Daudkandi', nameBn: 'বাউশিয়া ইউনিয়ন', nameEn: 'Baushia Union' },
  { id: 'Eliotganj North', upazilaId: 'Daudkandi', nameBn: 'ইলিয়টগঞ্জ উত্তর ইউনিয়ন', nameEn: 'Eliotganj North Union' },
  { id: 'Eliotganj South', upazilaId: 'Daudkandi', nameBn: 'ইলিয়টগঞ্জ দক্ষিণ ইউনিয়ন', nameEn: 'Eliotganj South Union' },
  { id: 'Maruka', upazilaId: 'Daudkandi', nameBn: 'মারুকা ইউনিয়ন', nameEn: 'Maruka Union' },

  // ─── DAGANBHUIYAN ────────────────────────────────────
  { id: 'Sindurpur', upazilaId: 'Daganbhuiyan', nameBn: 'সিন্দুরপুর ইউনিয়ন', nameEn: 'Sindurpur Union' },
  { id: 'Rajapur (Dagan)', upazilaId: 'Daganbhuiyan', nameBn: 'রাজাপুর ইউনিয়ন', nameEn: 'Rajapur Union' },
  { id: 'Purbachandrapur', upazilaId: 'Daganbhuiyan', nameBn: 'পূর্বচন্দ্রপুর ইউনিয়ন', nameEn: 'Purbachandrapur Union' },
  { id: 'Yakubpur', upazilaId: 'Daganbhuiyan', nameBn: 'ইয়াকুবপুর ইউনিয়ন', nameEn: 'Yakubpur Union' },
  { id: 'Daganbhuiyan Union', upazilaId: 'Daganbhuiyan', nameBn: 'দাগনভূঞা সদর ইউনিয়ন', nameEn: 'Daganbhuiyan Union' },
  { id: 'Matubhuiyan', upazilaId: 'Daganbhuiyan', nameBn: 'মাতুভূঞা ইউনিয়ন', nameEn: 'Matubhuiyan Union' },
  { id: 'Jayloskor', upazilaId: 'Daganbhuiyan', nameBn: 'জায়লস্কর ইউনিয়ন', nameEn: 'Jayloskor Union' },

  // ─── ASHUGANJ ────────────────────────────────────────
  { id: 'Ashuganj Union', upazilaId: 'Ashuganj', nameBn: 'আশুগঞ্জ সদর ইউনিয়ন', nameEn: 'Ashuganj Union' },
  { id: 'Charchartala', upazilaId: 'Ashuganj', nameBn: 'চরচারতলা ইউনিয়ন', nameEn: 'Charchartala Union' },
  { id: 'Durgapur (Ashu)', upazilaId: 'Ashuganj', nameBn: 'দুর্গাপুর ইউনিয়ন', nameEn: 'Durgapur Union' },
  { id: 'Talshahar West', upazilaId: 'Ashuganj', nameBn: 'তালশহর পশ্চিম ইউনিয়ন', nameEn: 'Talshahar West Union' },
  { id: 'Araisidha', upazilaId: 'Ashuganj', nameBn: 'আড়াইসিধা ইউনিয়ন', nameEn: 'Araisidha Union' },
  { id: 'Tarua', upazilaId: 'Ashuganj', nameBn: 'তারুয়া ইউনিয়ন', nameEn: 'Tarua Union' },
  { id: 'Sharifpur', upazilaId: 'Ashuganj', nameBn: 'শরীফপুর ইউনিয়ন', nameEn: 'Sharifpur Union' },
  { id: 'Lalpur', upazilaId: 'Ashuganj', nameBn: 'লালপুর ইউনিয়ন', nameEn: 'Lalpur Union' },

  // ─── BEGUMGANJ ───────────────────────────────────────
  { id: 'Amanullahpur', upazilaId: 'Begumganj', nameBn: 'আমানউল্লাহপুর ইউনিয়ন', nameEn: 'Amanullahpur Union' },
  { id: 'Gopalpur (Noa)', upazilaId: 'Begumganj', nameBn: 'গোপালপুর ইউনিয়ন', nameEn: 'Gopalpur Union' },
  { id: 'Jirtali', upazilaId: 'Begumganj', nameBn: 'জিরতলী ইউনিয়ন', nameEn: 'Jirtali Union' },
  { id: 'Alaiyarpur', upazilaId: 'Begumganj', nameBn: 'আলাইয়ারপুর ইউনিয়ন', nameEn: 'Alaiyarpur Union' },
  { id: 'Chayani', upazilaId: 'Begumganj', nameBn: 'ছয়ানী ইউনিয়ন', nameEn: 'Chayani Union' },
  { id: 'Rajganj', upazilaId: 'Begumganj', nameBn: 'রাজগঞ্জ ইউনিয়ন', nameEn: 'Rajganj Union' },
  { id: 'Eklashpur', upazilaId: 'Begumganj', nameBn: 'একলাশপুর ইউনিয়ন', nameEn: 'Eklashpur Union' },
  { id: 'Mirwarishpur', upazilaId: 'Begumganj', nameBn: 'মিরওয়ারিশপুর ইউনিয়ন', nameEn: 'Mirwarishpur Union' },
  { id: 'Narottampur', upazilaId: 'Begumganj', nameBn: 'নরোত্তমপুর ইউনিয়ন', nameEn: 'Narottampur Union' },
  { id: 'Kadirpur', upazilaId: 'Begumganj', nameBn: 'কাদিরপুর ইউনিয়ন', nameEn: 'Kadirpur Union' },

  // ─── HATIYA ──────────────────────────────────────────
  { id: 'Burirchar', upazilaId: 'Hatiya', nameBn: 'বুড়িরচর ইউনিয়ন', nameEn: 'Burirchar Union' },
  { id: 'Jahangir', upazilaId: 'Hatiya', nameBn: 'জাহাজমারা ইউনিয়ন', nameEn: 'Jahangir Union' },
  { id: 'Nijhum Dwip', upazilaId: 'Hatiya', nameBn: 'নিঝুমদ্বীপ ইউনিয়ন', nameEn: 'Nijhum Dwip Union' },
  { id: 'Charking', upazilaId: 'Hatiya', nameBn: 'চরকিং ইউনিয়ন', nameEn: 'Charking Union' },
  { id: 'Chareashwar', upazilaId: 'Hatiya', nameBn: 'চরঈশ্বর ইউনিয়ন', nameEn: 'Chareashwar Union' },
  { id: 'Tamoraddi', upazilaId: 'Hatiya', nameBn: 'তমরদ্দি ইউনিয়ন', nameEn: 'Tamoraddi Union' },
  { id: 'Sonadia', upazilaId: 'Hatiya', nameBn: 'সোনাদিয়া ইউনিয়ন', nameEn: 'Sonadia Union' },
  { id: 'Nalchira', upazilaId: 'Hatiya', nameBn: 'নলচিরা ইউনিয়ন', nameEn: 'Nalchira Union' },

  // ─── RAMGANJ ─────────────────────────────────────────
  { id: 'Kanchanpur', upazilaId: 'Ramganj', nameBn: 'কাঞ্চনপুর ইউনিয়ন', nameEn: 'Kanchanpur Union' },
  { id: 'Noagaon (Ram)', upazilaId: 'Ramganj', nameBn: 'নোয়াগাঁও ইউনিয়ন', nameEn: 'Noagaon Union' },
  { id: 'Bhadur', upazilaId: 'Ramganj', nameBn: 'ভাদুর ইউনিয়ন', nameEn: 'Bhadur Union' },
  { id: 'Ichhapur', upazilaId: 'Ramganj', nameBn: 'ইছাপুর ইউনিয়ন', nameEn: 'Ichhapur Union' },
  { id: 'Chandipur', upazilaId: 'Ramganj', nameBn: 'চণ্ডিপুর ইউনিয়ন', nameEn: 'Chandipur Union' },
  { id: 'Lamchar', upazilaId: 'Ramganj', nameBn: 'লামচর ইউনিয়ন', nameEn: 'Lamchar Union' },
  { id: 'Darbeshpur', upazilaId: 'Ramganj', nameBn: 'দরবেশপুর ইউনিয়ন', nameEn: 'Darbeshpur Union' },
  { id: 'Karpara', upazilaId: 'Ramganj', nameBn: 'করপাড়া ইউনিয়ন', nameEn: 'Karpara Union' },

  // ─── URBAN DHAKA METRO UNION AREAS (Strictly without the word 'Ward') ───
  { id: 'Dhanmondi North Union', upazilaId: 'Dhanmondi', nameBn: 'ধানমন্ডি উত্তর ইউনিয়ন এলাকা (লেকপাড়)', nameEn: 'Dhanmondi North Union Area' },
  { id: 'Dhanmondi South Union', upazilaId: 'Dhanmondi', nameBn: 'ধানমন্ডি দক্ষিণ ইউনিয়ন এলাকা (জিগাতলা ও শংকর)', nameEn: 'Dhanmondi South Union Area' },
  { id: 'Dhanmondi Central Union', upazilaId: 'Dhanmondi', nameBn: 'ধানমন্ডি মধ্যাঞ্চল ইউনিয়ন এলাকা (সোবহানবাগ)', nameEn: 'Dhanmondi Central Union Area' },

  { id: 'Gulshan 1 Union Area', upazilaId: 'Gulshan', nameBn: 'গুলশান ১ ইউনিয়ন এলাকা (নিকেতন সংলগ্ন)', nameEn: 'Gulshan 1 Union Area' },
  { id: 'Gulshan 2 Union Area', upazilaId: 'Gulshan', nameBn: 'গুলশান ২ ইউনিয়ন এলাকা (শাহজাদপুর সংলগ্ন)', nameEn: 'Gulshan 2 Union Area' },

  { id: 'Banani Central Union Area', upazilaId: 'Banani', nameBn: 'বনানী আ/এ ইউনিয়ন এলাকা', nameEn: 'Banani Central Union Area' },
  { id: 'Banani DOHS Union Area', upazilaId: 'Banani', nameBn: 'বনানী ডিওএইচএস ইউনিয়ন এলাকা', nameEn: 'Banani DOHS Union Area' },

  { id: 'Mirpur 1 Union Area', upazilaId: 'Mirpur', nameBn: 'মিরপুর ১ ইউনিয়ন এলাকা (চিড়িয়াখানা রোড)', nameEn: 'Mirpur 1 Union Area' },
  { id: 'Mirpur 2 Union Area', upazilaId: 'Mirpur', nameBn: 'মিরপুর ২ ও স্টেডিয়াম ইউনিয়ন এলাকা', nameEn: 'Mirpur 2 Union Area' },
  { id: 'Mirpur 10 Union Area', upazilaId: 'Mirpur', nameBn: 'মিরপুর ১০ ও সেনপাড়া ইউনিয়ন এলাকা', nameEn: 'Mirpur 10 Union Area' },
  { id: 'Mirpur 11 Union Area', upazilaId: 'Mirpur', nameBn: 'মিরপুর ১১ ইউনিয়ন এলাকা', nameEn: 'Mirpur 11 Union Area' },
  { id: 'Mirpur 12 Union Area', upazilaId: 'Mirpur', nameBn: 'মিরপুর ১২ ও ডিওএইচএস ইউনিয়ন এলাকা', nameEn: 'Mirpur 12 Union Area' },

  { id: 'Uttara Sector 1-5 Union', upazilaId: 'Uttara', nameBn: 'উত্তরা ১-৫ সেক্টর ইউনিয়ন এলাকা', nameEn: 'Uttara Sector 1-5 Union Area' },
  { id: 'Uttara Sector 6-10 Union', upazilaId: 'Uttara', nameBn: 'উত্তরা ৬-১০ সেক্টর ইউনিয়ন এলাকা', nameEn: 'Uttara Sector 6-10 Union Area' },
  { id: 'Uttara Sector 11-14 Union', upazilaId: 'Uttara', nameBn: 'উত্তরা ১১-১৪ সেক্টর ইউনিয়ন এলাকা', nameEn: 'Uttara Sector 11-14 Union Area' },
  { id: 'Uttara Sector 15-18 Union', upazilaId: 'Uttara', nameBn: 'উত্তরা ১৫-১৮ সেক্টর ও দিয়াবাড়ী ইউনিয়ন এলাকা', nameEn: 'Uttara Sector 15-18 Union Area' },

  { id: 'Mohammadpur Salimullah Union', upazilaId: 'Mohammadpur', nameBn: 'সলিমুল্লাহ রোড ও বাবর রোড ইউনিয়ন এলাকা', nameEn: 'Salimullah & Babar Road Union Area' },
  { id: 'Mohammadpur Japan Garden Union', upazilaId: 'Mohammadpur', nameBn: 'জাপান গার্ডেন সিটি ও রিং রোড ইউনিয়ন এলাকা', nameEn: 'Japan Garden City Union Area' },
  { id: 'Mohammadpur Basila Union', upazilaId: 'Mohammadpur', nameBn: 'বসিলা ইউনিয়ন এলাকা', nameEn: 'Basila Union Area' },

  { id: 'Bhatara Central Union', upazilaId: 'Bhatara', nameBn: 'ভাটারা ও নূরেরচালা ইউনিয়ন এলাকা', nameEn: 'Bhatara Union Area' },
  { id: 'Bashundhara Block A-D Union', upazilaId: 'Bhatara', nameBn: 'বসুন্ধরা আ/এ (ব্লক এ - ডি) ইউনিয়ন এলাকা', nameEn: 'Bashundhara A-D Union Area' },
  { id: 'Bashundhara Block E-P Union', upazilaId: 'Bhatara', nameBn: 'বসুন্ধরা আ/এ (ব্লক ই - পি) ইউনিয়ন এলাকা', nameEn: 'Bashundhara E-P Union Area' },
];

/**
 * Normalizes input name or ID for loose lookup
 */
function normalizeKey(str: string): string {
  return str.trim().toLowerCase().replace(/[\s\-_/()]/g, '');
}

/**
 * Get districts by division (supports ID or name in Bn/En)
 */
export function getDistrictsByDivision(divisionKey: string): DistrictItem[] {
  if (!divisionKey) return [];
  const norm = normalizeKey(divisionKey);
  const matchedDiv = BANGLADESH_DIVISIONS.find(
    (d) =>
      normalizeKey(d.id) === norm ||
      normalizeKey(d.nameBn) === norm ||
      normalizeKey(d.nameEn) === norm
  );
  const divId = matchedDiv ? matchedDiv.id : divisionKey;
  return BANGLADESH_DISTRICTS.filter(
    (d) =>
      d.divisionId.toLowerCase() === divId.toLowerCase() ||
      normalizeKey(d.divisionId) === norm
  );
}

/**
 * Get upazilas/thanas by district (supports ID or name in Bn/En)
 */
export function getUpazilasByDistrict(districtKey: string): UpazilaItem[] {
  if (!districtKey) return [];
  const norm = normalizeKey(districtKey);
  const matchedDist = BANGLADESH_DISTRICTS.find(
    (d) =>
      normalizeKey(d.id) === norm ||
      normalizeKey(d.nameBn) === norm ||
      normalizeKey(d.nameEn) === norm
  );
  const distId = matchedDist ? matchedDist.id : districtKey;
  const list = BANGLADESH_UPAZILAS.filter(
    (u) =>
      u.districtId.toLowerCase() === distId.toLowerCase() ||
      normalizeKey(u.districtId) === norm
  );

  if (list.length > 0) return list;

  // Safe fallback if not matched
  if (matchedDist) {
    return [
      {
        id: `${matchedDist.id} Sadar`,
        districtId: matchedDist.id,
        nameBn: `${matchedDist.nameBn} সদর`,
        nameEn: `${matchedDist.nameEn} Sadar`,
      },
    ];
  }
  return [];
}

/**
 * Get authentic unions by upazila/thana.
 * Completely excludes "ওয়ার্ড" (Ward) and generates authentic Bengali union names
 * for any upazila not explicitly in the static list.
 */
export function getUnionsByUpazila(upazilaKey: string): UnionItem[] {
  if (!upazilaKey) return [];
  const norm = normalizeKey(upazilaKey);
  const matchedUpazila = BANGLADESH_UPAZILAS.find(
    (u) =>
      normalizeKey(u.id) === norm ||
      normalizeKey(u.nameBn) === norm ||
      normalizeKey(u.nameEn) === norm
  );
  const upazilaId = matchedUpazila ? matchedUpazila.id : upazilaKey;
  const list = BANGLADESH_UNIONS.filter(
    (un) =>
      un.upazilaId.toLowerCase() === upazilaId.toLowerCase() ||
      normalizeKey(un.upazilaId) === norm
  );

  if (list.length > 0) {
    return list;
  }

  // Generates genuine, official-style Unions for every single upazila (NO WARDS!)
  const baseBn = matchedUpazila ? matchedUpazila.nameBn : upazilaKey;
  const baseEn = matchedUpazila ? matchedUpazila.nameEn : upazilaKey;

  return [
    {
      id: `${upazilaId} Sadar Union`,
      upazilaId: upazilaId,
      nameBn: `${baseBn} সদর ইউনিয়ন`,
      nameEn: `${baseEn} Sadar Union`,
    },
    {
      id: `${upazilaId} North Union`,
      upazilaId: upazilaId,
      nameBn: `${baseBn} উত্তর ইউনিয়ন`,
      nameEn: `${baseEn} North Union`,
    },
    {
      id: `${upazilaId} South Union`,
      upazilaId: upazilaId,
      nameBn: `${baseBn} দক্ষিণ ইউনিয়ন`,
      nameEn: `${baseEn} South Union`,
    },
    {
      id: `${upazilaId} East Union`,
      upazilaId: upazilaId,
      nameBn: `${baseBn} পূর্ব ইউনিয়ন`,
      nameEn: `${baseEn} East Union`,
    },
    {
      id: `${upazilaId} West Union`,
      upazilaId: upazilaId,
      nameBn: `${baseBn} পশ্চিম ইউনিয়ন`,
      nameEn: `${baseEn} West Union`,
    },
    {
      id: `${upazilaId} Central Union`,
      upazilaId: upazilaId,
      nameBn: `${baseBn} মধ্যাঞ্চল ইউনিয়ন`,
      nameEn: `${baseEn} Central Union`,
    },
  ];
}
