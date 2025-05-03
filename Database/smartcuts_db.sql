-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 03, 2025 at 08:46 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `smartcuts_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `admin_id` int(11) NOT NULL,
  `username` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(150) NOT NULL,
  `phone_number` varchar(15) NOT NULL,
  `photo` longblob NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`admin_id`, `username`, `password`, `email`, `phone_number`, `photo`, `created_at`) VALUES
(4, 'glowgo_admin', '$2y$10$2goSY7xfaAYbwGDno9b65OboJ/FShMH9Wrr2lUq4OAuKqTsNLMgHa', 'admin@glowgo.com', '9876543210', 0x75706c6f6164732f345f633636303933373130363231633763392e6a7067, '2025-04-14 09:54:59'),
(5, 'urban_admin', '$2y$10$ddFMMNIyJ0VJUmGO3W.iHODTQZI3x7fpALqLoC22AGJz.elpw3rYy', 'contact@urbanstyles.com', '9123456780', 0x75706c6f6164732f355f333132303164316164633331666662662e6a7067, '2025-04-14 09:56:18'),
(6, 'hairbar_admin', '$2y$10$7dKiTQ6G4D/hFrR97su5Ke8s204F.blLNO9XLY7wooz.keKeTvIi.', 'hello@thehairbar.com', '9988776655', '', '2025-04-14 09:56:32'),
(7, 'bliss_admin', '$2y$10$HVeC2uqXXVC3LMkPmCSIluFI.L4yr1hKfQiQEbrsf.1QiruSfpnfe', 'support@blissbeauty.com', '9090909090', '', '2025-04-14 09:56:46'),
(8, 'chiccuts_admin', '$2y$10$yCD0f70T9gIeqZSleO8ctO.jRoLPeWWne2.9lpMr77CGZluo12dy.', 'admin@chiccuts.com', '9345678901', '', '2025-04-14 09:56:55');

-- --------------------------------------------------------

--
-- Table structure for table `appointment`
--

CREATE TABLE `appointment` (
  `appointment_id` int(11) NOT NULL,
  `customer_id` int(11) NOT NULL,
  `admin_id` int(11) NOT NULL,
  `service_id` int(11) NOT NULL,
  `staff_id` int(11) NOT NULL,
  `appointment_date` datetime NOT NULL,
  `status` enum('booked','completed','cancelled') NOT NULL,
  `payment_status` enum('pending','paid') NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `salon_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `appointment`
--

INSERT INTO `appointment` (`appointment_id`, `customer_id`, `admin_id`, `service_id`, `staff_id`, `appointment_date`, `status`, `payment_status`, `created_at`, `salon_id`) VALUES
(56, 10, 0, 7, 6, '2025-05-04 09:00:00', 'booked', 'pending', '2025-04-20 04:30:00', 5),
(57, 11, 0, 8, 7, '2025-05-04 10:30:00', 'booked', 'pending', '2025-04-21 05:45:00', 5),
(58, 12, 0, 9, 18, '2025-05-04 11:15:00', 'booked', 'pending', '2025-04-22 07:00:00', 5),
(59, 13, 0, 7, 6, '2025-05-04 12:00:00', 'booked', 'pending', '2025-04-23 04:15:00', 5),
(60, 14, 0, 8, 7, '2025-05-04 13:00:00', 'booked', 'pending', '2025-04-24 08:50:00', 5),
(61, 15, 0, 9, 18, '2025-05-04 14:30:00', 'booked', 'pending', '2025-04-25 09:35:00', 5),
(62, 16, 0, 7, 6, '2025-05-04 15:15:00', 'booked', 'pending', '2025-04-26 11:10:00', 5),
(63, 17, 0, 8, 7, '2025-05-04 16:00:00', 'cancelled', '', '2025-04-27 04:40:00', 5),
(64, 18, 0, 9, 18, '2025-05-04 17:00:00', 'booked', 'pending', '2025-04-28 08:25:00', 5),
(65, 19, 0, 7, 6, '2025-05-04 18:30:00', 'booked', 'pending', '2025-04-29 11:55:00', 5),
(76, 14, 5, 7, 18, '2025-05-06 09:00:00', 'booked', 'pending', '2025-05-01 04:30:00', 5),
(77, 15, 5, 8, 18, '2025-05-06 13:00:00', 'booked', 'pending', '2025-05-01 04:35:00', 5),
(78, 16, 5, 9, 18, '2025-05-07 10:00:00', 'booked', 'pending', '2025-05-01 04:40:00', 5),
(79, 17, 5, 7, 18, '2025-05-07 15:00:00', 'booked', 'pending', '2025-05-01 04:45:00', 5),
(80, 18, 5, 8, 18, '2025-05-08 09:30:00', 'booked', 'pending', '2025-05-01 04:50:00', 5),
(81, 19, 5, 9, 18, '2025-05-08 14:00:00', 'booked', 'pending', '2025-05-01 04:55:00', 5),
(82, 20, 5, 7, 18, '2025-05-09 11:00:00', 'booked', 'pending', '2025-05-01 05:00:00', 5),
(83, 21, 5, 8, 18, '2025-05-09 16:00:00', 'booked', 'pending', '2025-05-01 05:05:00', 5),
(84, 22, 5, 9, 18, '2025-05-10 10:00:00', 'booked', 'pending', '2025-05-01 05:10:00', 5),
(85, 23, 5, 7, 18, '2025-05-10 14:30:00', 'booked', 'pending', '2025-05-01 05:15:00', 5),
(91, 14, 0, 7, 18, '2025-05-10 10:00:00', 'booked', 'pending', '2025-05-03 16:29:57', 5);

-- --------------------------------------------------------

--
-- Table structure for table `customer`
--

CREATE TABLE `customer` (
  `customer_id` int(11) NOT NULL,
  `username` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(150) NOT NULL,
  `phone_number` varchar(15) NOT NULL,
  `photo` longblob NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `customer`
--

INSERT INTO `customer` (`customer_id`, `username`, `password`, `email`, `phone_number`, `photo`, `created_at`) VALUES
(10, 'alice_khan', '$2y$10$E19TUiC4rdFJ.y5pHjCuoOy2.fZr2Ap3YePznx/Wdypsw4Gna8bsu', 'alice.khan@gmail.com', '9123450001', '', '2025-04-15 03:30:00'),
(11, 'bob_ross', '$2y$10$E19TUiC4rdFJ.y5pHjCuoOy2.fZr2Ap3YePznx/Wdypsw4Gna8bsu', 'bob.ross@yahoo.com', '9123450002', '', '2025-04-15 03:40:00'),
(12, 'charlie_doe', '$2y$10$E19TUiC4rdFJ.y5pHjCuoOy2.fZr2Ap3YePznx/Wdypsw4Gna8bsu', 'charlie.doe@hotmail.com', '9123450003', '', '2025-04-15 03:50:00'),
(13, 'diana_prince', '$2y$10$E19TUiC4rdFJ.y5pHjCuoOy2.fZr2Ap3YePznx/Wdypsw4Gna8bsu', 'diana.prince@outlook.com', '9123450004', '', '2025-04-15 04:00:00'),
(14, 'anika_raj', '$2y$10$9ycZX9jNmrmulsHioUmXZ.KCt44PWqebDi/VGyjm2O3E97Y/Fhy9y', 'anika_raj@gmail.com', '9812345678', 0x363831363564636433326530382e6a7067, '2025-04-14 13:30:01'),
(15, 'rohan_mehta', '$2y$10$ONeu4NsiOgBcuCM60FfBQu9aO4PSp6fsLrym2CPujxZMJG4kKiUIu', 'rohan.mehta@yahoo.com', '9876543212', '', '2025-04-14 13:30:15'),
(16, 'meera_singh', '$2y$10$b5Xks5LRvBZHFusSqV3eZOBily.AvuYSEquo94ENPs7zb2qPR8Pnm', 'meera.singh@hotmail.com', '9988776655', '', '2025-04-14 13:30:24'),
(17, 'vishal_kumar', '$2y$10$jCBcJR6obiQl.dzOMDEkU.wG9wsIhwVY0AXxolMbf88YceCyWBqZ6', 'vishal.kumar@gmail.com', '9765432188', '', '2025-04-14 13:30:35'),
(18, 'sanya_jain', '$2y$10$eylLWOKsxnO26HiZnAbYj.a6HNgDFGpIH.aNTXjptCAAC2PEr6Mm.', 'sanya.jain@outlook.com', '9090901122', '', '2025-04-14 13:30:47'),
(19, 'malhar2460', '$2y$10$bJzB/KgXDRNnyVMm7l1LA.3AwpuUls6hHzsCkjqycOJmTHDtBtsc6', 'malhar.c.prajapati@gmail.com', '9978647546', 0x75706c6f6164732f3132373937343334362e6a706567, '2025-04-18 06:40:20');

-- --------------------------------------------------------

--
-- Table structure for table `customer_queries`
--

CREATE TABLE `customer_queries` (
  `submission_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `subject` varchar(100) NOT NULL,
  `message` text NOT NULL,
  `submission_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` enum('pending','resolved') NOT NULL DEFAULT 'pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `customer_queries`
--

INSERT INTO `customer_queries` (`submission_id`, `name`, `email`, `subject`, `message`, `submission_date`, `status`) VALUES
(4, 'Rahul Sharma', 'rahul.sharma@example.com', 'Pricing Inquiry', 'Hi—what’s the cost of a 60‑minute facial?', '2025-04-02 04:30:00', 'pending'),
(5, 'Priya Patel', 'priya.patel@example.com', 'Reschedule', 'Can I move my 05/10 appointment to 05/18?', '2025-04-02 05:00:00', 'pending'),
(6, 'Amit Desai', 'amit.desai@example.com', 'New Service', 'Do you offer bridal makeup packages?', '2025-04-02 05:30:00', 'pending'),
(7, 'Sneha Mehta', 'sneha.mehta@example.com', 'Group Booking', 'Need 3 seats for bridal trial on 05/15.', '2025-04-02 06:00:00', 'pending'),
(8, 'Karan Singh', 'karan.singh@example.com', 'Feedback', 'Loved today’s massage—thank you!', '2025-04-02 06:30:00', 'resolved');

-- --------------------------------------------------------

--
-- Table structure for table `payment`
--

CREATE TABLE `payment` (
  `payment_id` int(11) NOT NULL,
  `appointment_id` int(11) NOT NULL,
  `amount` decimal(10,0) NOT NULL,
  `payment_method` enum('credit_card','debit_card','paypal','wallet') NOT NULL,
  `payment_date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `payment`
--

INSERT INTO `payment` (`payment_id`, `appointment_id`, `amount`, `payment_method`, `payment_date`) VALUES
(1, 1, 4000000, 'credit_card', '2025-05-01 02:35:00'),
(2, 2, 500, 'debit_card', '2025-05-01 03:05:00'),
(3, 3, 300, 'paypal', '2025-05-01 03:35:00'),
(4, 4, 800, 'wallet', '2025-05-01 04:05:00'),
(5, 5, 1500, 'credit_card', '2025-05-01 04:35:00'),
(6, 6, 400, 'debit_card', '2025-05-01 04:50:00'),
(7, 7, 350, 'paypal', '2025-05-01 05:20:00'),
(8, 8, 1200, 'wallet', '2025-05-01 05:50:00'),
(9, 9, 250, 'credit_card', '2025-05-01 06:20:00'),
(10, 10, 1000, 'debit_card', '2025-05-01 06:50:00'),
(21, 91, 300, '', '2025-05-03 16:29:57'),
(22, 92, 1200, '', '2025-05-03 16:33:04');

-- --------------------------------------------------------

--
-- Table structure for table `review`
--

CREATE TABLE `review` (
  `review_id` int(11) NOT NULL,
  `customer_id` int(11) NOT NULL,
  `service_id` int(11) NOT NULL,
  `rating` int(11) NOT NULL,
  `review_text` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `salon_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `review`
--

INSERT INTO `review` (`review_id`, `customer_id`, `service_id`, `rating`, `review_text`, `created_at`, `salon_id`) VALUES
(1, 14, 4, 5, 'Fantastic hair wash—so refreshing!', '2025-04-05 04:30:00', 4),
(2, 15, 7, 4, 'Great haircut but a bit rushed.', '2025-04-05 05:30:00', 5),
(3, 16, 10, 5, 'Amazing manicure experience!', '2025-04-05 06:30:00', 6),
(4, 17, 13, 3, 'Facial was okay, could be deeper.', '2025-04-05 07:30:00', 7),
(5, 14, 17, 4, 'Waxing done very professionally.', '2025-04-06 04:30:00', 8),
(6, 16, 5, 5, 'Pedicure left my feet feeling great.', '2025-04-06 05:30:00', 4),
(7, 14, 6, 5, 'Massage was super relaxing.', '2025-04-06 06:30:00', 4),
(8, 15, 9, 3, 'Threading was okay, slight discomfort.', '2025-04-06 07:30:00', 5),
(9, 10, 7, 5, 'Fantastic cut, very professional!', '2025-05-05 04:00:00', 5),
(10, 11, 8, 4, 'Great beard styling, will return.', '2025-05-05 05:30:00', 5),
(11, 12, 9, 5, 'Loved the shave, perfect detail.', '2025-05-05 07:15:00', 5),
(12, 13, 7, 3, 'Good service but a bit slow.', '2025-05-05 08:40:00', 5),
(13, 14, 8, 4, 'Nice atmosphere and friendly staff.', '2025-05-05 09:50:00', 5),
(14, 15, 9, 2, 'Not very satisfied with the end result.', '2025-05-05 11:05:00', 5),
(15, 16, 7, 5, 'Excellent cut, exactly what I asked for.', '2025-05-05 12:20:00', 5),
(16, 17, 8, 4, 'Beard trim was clean, thank you!', '2025-05-05 04:35:00', 5),
(17, 18, 9, 5, 'Shave was smooth and quick.', '2025-05-05 06:10:00', 5),
(18, 19, 7, 3, 'Decent service, could improve timing.', '2025-05-05 07:45:00', 5);

-- --------------------------------------------------------

--
-- Table structure for table `salon`
--

CREATE TABLE `salon` (
  `salon_id` int(11) NOT NULL,
  `salon_name` varchar(150) NOT NULL,
  `location` varchar(250) NOT NULL,
  `contact` varchar(20) NOT NULL,
  `admin_id` int(11) NOT NULL,
  `description` text NOT NULL,
  `image` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `salon`
--

INSERT INTO `salon` (`salon_id`, `salon_name`, `location`, `contact`, `admin_id`, `description`, `image`) VALUES
(4, 'Glow & Go Salon', '12 MG Road, Andheri West, Mumbai', '022-23456789', 4, 'A modern salon offering premium hair, skin, and spa services.', '..//img.png'),
(5, 'Urban Styles', '45 Residency Road, Indiranagar, Bangalore', '080-22334455', 5, 'Trendy urban salon with expert stylists and modern ambiance.', '..//img-1.png'),
(6, 'The Hair Bar', 'Saket Mall, New Delhi', '011-44556677', 6, 'Professional hair styling, coloring, and grooming services.', '..//img-3.png'),
(7, 'Bliss Beauty Lounge', 'Laxmi Road, Pune', '020-33445566', 7, 'Luxurious beauty treatments with organic and herbal products.', '..//img-2.png'),
(8, 'Chic Cuts Studio', 'Bistupur Main Road, Jamshedpur', '0657-2223344', 8, 'Trendy salon with creative hairstyling and grooming solutions.', '..//img-1.png');

-- --------------------------------------------------------

--
-- Table structure for table `services`
--

CREATE TABLE `services` (
  `service_id` int(11) NOT NULL,
  `service_name` varchar(150) NOT NULL,
  `category` varchar(100) NOT NULL,
  `price` decimal(10,0) NOT NULL,
  `duration` int(11) NOT NULL,
  `description` text NOT NULL,
  `salon_id` int(11) NOT NULL,
  `image` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `services`
--

INSERT INTO `services` (`service_id`, `service_name`, `category`, `price`, `duration`, `description`, `salon_id`, `image`) VALUES
(4, 'Classic Haircut', 'Hair', 350, 30, 'Personalized haircut with expert stylist.', 4, '..//haircut.jpg'),
(5, 'Herbal Facial', 'Skin', 700, 45, 'Soothing facial using herbal products for glowing skin.', 4, '..//facial.jpeg'),
(6, 'Manicure & Pedicure', 'Nails', 850, 60, 'Relaxing mani-pedi combo with massage.', 4, '..//manipedi.jpg'),
(7, 'Beard Styling', 'Grooming', 300, 20, 'Professional beard trimming and shaping.', 5, '..//beard.jpeg'),
(8, 'Hair Coloring', 'Hair', 1200, 90, 'Global or highlight hair coloring with branded products.', 5, '..//haircolor.jpg'),
(9, 'Detan Face Pack', 'Skin', 450, 30, 'Instant glow with detan face treatment.', 5, '..//detan.jpeg'),
(10, 'Hair Spa', 'Hair', 900, 60, 'Deep conditioning and scalp massage for hair health.', 6, '..//hairspa.jpg'),
(11, 'Threading (Eyebrows)', 'Beauty', 60, 10, 'Precise eyebrow shaping with threading.', 6, '..//threading.jpg'),
(12, 'Basic Cleanup', 'Skin', 500, 35, 'Quick face cleansing and massage.', 6, '..//cleanup.jpg'),
(13, 'Bridal Makeup', 'Makeup', 6000, 120, 'Full bridal makeup with pre-wedding consultation.', 7, '..//bridal.jpg'),
(14, 'Head Massage', 'Spa', 300, 20, 'Stress-relieving head massage with oils.', 7, '..//headmassage.jpg'),
(15, 'Straightening', 'Hair', 2000, 120, 'Hair straightening using L’Oreal and Schwarzkopf.', 8, '..//straightening.jpg'),
(16, 'Body Wax', 'Beauty', 1500, 90, 'Complete waxing package using aloe-vera wax.', 8, '..//waxing.jpeg'),
(17, 'O3+ Whitening Facial', 'Skin', 1100, 60, 'Skin brightening facial using O3+ products.', 8, '..//O3.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `staff`
--

CREATE TABLE `staff` (
  `staff_id` int(11) NOT NULL,
  `username` varchar(150) NOT NULL,
  `password` varchar(255) NOT NULL,
  `specialization` varchar(100) NOT NULL,
  `phone_number` varchar(15) NOT NULL,
  `email` varchar(150) NOT NULL,
  `availability` enum('available','unavailable') NOT NULL,
  `salon_id` int(11) NOT NULL,
  `photo` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `staff`
--

INSERT INTO `staff` (`staff_id`, `username`, `password`, `specialization`, `phone_number`, `email`, `availability`, `salon_id`, `photo`) VALUES
(4, 'Ravi Kumar', '', 'Hair Stylist', '9876543210', 'ravi.kumar@salon.com', 'available', 4, '..//ravi_kumar.jpeg'),
(5, 'Priya Sharma', '', 'Facial Specialist', '9876543211', 'priya.sharma@salon.com', 'available', 4, '..//priya_sharma.jpg'),
(6, 'Anjali Verma', '$2y$10$Ol6u0pSxtOceDBJAQGhwreHkRix0FBgD7HVU29bpJK3mkV3s/2Xde', 'Hair Stylist', '9876543212', 'anjali.verma@salon.com', 'available', 5, '..//anjali_verma.jpg'),
(7, 'Vikram Yadav', '', 'Beard Stylist', '9876543213', 'vikram.yadav@salon.com', 'available', 5, '..//vikram_yadav.jpg'),
(8, 'Nisha Reddy', '', 'Nail Technician', '9876543214', 'nisha.reddy@salon.com', 'available', 6, '..//nisha_reddy.jpg'),
(9, 'Deepika Iyer', '', 'Hair Specialist', '9876543215', 'deepika.iyer@salon.com', 'available', 6, '..//deepika_iyer.jpg'),
(10, 'Meera Patel', '', 'Makeup Artist', '9876543216', 'meera.patel@salon.com', 'available', 7, '..//meera_patel.jpg'),
(11, 'Rajesh Gupta', '', 'Hair Stylist', '9876543217', 'rajesh.gupta@salon.com', 'available', 7, '..//rajesh_gupta.jpg'),
(12, 'Neha Singh', '', 'Hair Stylist', '9876543218', 'neha.singh@salon.com', 'available', 8, '..//neha_singh.jpg'),
(13, 'Karan Mehta', '', 'Facial Specialist', '9876543219', 'karan.mehta@salon.com', 'available', 8, '..//karan_mehta.jpeg'),
(18, 'Malhar', '$2y$10$j2Foj6pveM.tgoQb2qllmuubX5Ysg8ThMJ1SXNYbCh8q.3VxeHGYO', 'Nothing', '9978647546', 'malhar.c.prajapati@gmail.com', 'unavailable', 5, '1746269457_127974346.jpeg');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`admin_id`);

--
-- Indexes for table `appointment`
--
ALTER TABLE `appointment`
  ADD PRIMARY KEY (`appointment_id`);

--
-- Indexes for table `customer`
--
ALTER TABLE `customer`
  ADD PRIMARY KEY (`customer_id`);

--
-- Indexes for table `customer_queries`
--
ALTER TABLE `customer_queries`
  ADD PRIMARY KEY (`submission_id`);

--
-- Indexes for table `payment`
--
ALTER TABLE `payment`
  ADD PRIMARY KEY (`payment_id`);

--
-- Indexes for table `review`
--
ALTER TABLE `review`
  ADD PRIMARY KEY (`review_id`);

--
-- Indexes for table `salon`
--
ALTER TABLE `salon`
  ADD PRIMARY KEY (`salon_id`);

--
-- Indexes for table `services`
--
ALTER TABLE `services`
  ADD PRIMARY KEY (`service_id`);

--
-- Indexes for table `staff`
--
ALTER TABLE `staff`
  ADD PRIMARY KEY (`staff_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin`
--
ALTER TABLE `admin`
  MODIFY `admin_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `appointment`
--
ALTER TABLE `appointment`
  MODIFY `appointment_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=93;

--
-- AUTO_INCREMENT for table `customer`
--
ALTER TABLE `customer`
  MODIFY `customer_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `customer_queries`
--
ALTER TABLE `customer_queries`
  MODIFY `submission_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `payment`
--
ALTER TABLE `payment`
  MODIFY `payment_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `review`
--
ALTER TABLE `review`
  MODIFY `review_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `salon`
--
ALTER TABLE `salon`
  MODIFY `salon_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `services`
--
ALTER TABLE `services`
  MODIFY `service_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `staff`
--
ALTER TABLE `staff`
  MODIFY `staff_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
