-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 18, 2025 at 08:03 PM
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
(4, 'glowgo_admin', '$2y$10$2goSY7xfaAYbwGDno9b65OboJ/FShMH9Wrr2lUq4OAuKqTsNLMgHa', 'admin@glowgo.com', '9876543210', '', '2025-04-14 09:54:59'),
(5, 'urban_admin', '$2y$10$ddFMMNIyJ0VJUmGO3W.iHODTQZI3x7fpALqLoC22AGJz.elpw3rYy', 'contact@urbanstyles.com', '9123456780', 0x75706c6f6164732f355f316562326133336535316333343664302e77656270, '2025-04-14 09:56:18'),
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
(7, 19, 5, 7, 6, '2025-04-19 14:30:00', 'booked', 'paid', '2025-04-18 15:44:00', 5);

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
(14, 'anika_raj', '$2y$10$9ycZX9jNmrmulsHioUmXZ.KCt44PWqebDi/VGyjm2O3E97Y/Fhy9y', 'anika_raj@gmail.com', '9812345678', 0x363830323531346261393262632e706e67, '2025-04-14 13:30:01'),
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
  `staff_name` varchar(150) NOT NULL,
  `specialization` varchar(100) NOT NULL,
  `phone_number` varchar(15) NOT NULL,
  `email` varchar(150) NOT NULL,
  `availability` enum('available','unavailable') NOT NULL,
  `salon_id` int(11) NOT NULL,
  `image` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `staff`
--

INSERT INTO `staff` (`staff_id`, `staff_name`, `specialization`, `phone_number`, `email`, `availability`, `salon_id`, `image`) VALUES
(4, 'Ravi Kumar', 'Hair Stylist', '9876543210', 'ravi.kumar@salon.com', 'available', 4, '..//ravi_kumar.jpeg'),
(5, 'Priya Sharma', 'Facial Specialist', '9876543211', 'priya.sharma@salon.com', 'available', 4, '..//priya_sharma.jpg'),
(6, 'Anjali Verma', 'Hair Stylist', '9876543212', 'anjali.verma@salon.com', 'available', 5, '..//anjali_verma.jpg'),
(7, 'Vikram Yadav', 'Beard Stylist', '9876543213', 'vikram.yadav@salon.com', 'available', 5, '..//vikram_yadav.jpg'),
(8, 'Nisha Reddy', 'Nail Technician', '9876543214', 'nisha.reddy@salon.com', 'available', 6, '..//nisha_reddy.jpg'),
(9, 'Deepika Iyer', 'Hair Specialist', '9876543215', 'deepika.iyer@salon.com', 'available', 6, '..//deepika_iyer.jpg'),
(10, 'Meera Patel', 'Makeup Artist', '9876543216', 'meera.patel@salon.com', 'available', 7, '..//meera_patel.jpg'),
(11, 'Rajesh Gupta', 'Hair Stylist', '9876543217', 'rajesh.gupta@salon.com', 'available', 7, '..//rajesh_gupta.jpg'),
(12, 'Neha Singh', 'Hair Stylist', '9876543218', 'neha.singh@salon.com', 'available', 8, '..//neha_singh.jpg'),
(13, 'Karan Mehta', 'Facial Specialist', '9876543219', 'karan.mehta@salon.com', 'available', 8, '..//karan_mehta.jpeg');

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
  MODIFY `appointment_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `customer`
--
ALTER TABLE `customer`
  MODIFY `customer_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `customer_queries`
--
ALTER TABLE `customer_queries`
  MODIFY `submission_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `payment`
--
ALTER TABLE `payment`
  MODIFY `payment_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `review`
--
ALTER TABLE `review`
  MODIFY `review_id` int(11) NOT NULL AUTO_INCREMENT;

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
  MODIFY `staff_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
