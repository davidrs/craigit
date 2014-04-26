-- phpMyAdmin SQL Dump
-- version 4.0.4.1
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Apr 26, 2014 at 04:27 AM
-- Server version: 5.5.32
-- PHP Version: 5.4.19

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: ``
--
CREATE DATABASE IF NOT EXISTS `some_db_name` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `some_db_name`;

-- --------------------------------------------------------

--
-- Table structure for table `searches`
--

CREATE TABLE IF NOT EXISTS `searches` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(50) NOT NULL,
  `filter` varchar(400) NOT NULL,
  `query` varchar(400) NOT NULL,
  `sentListings` varchar(400) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=21 ;

--
-- Dumping data for table `searches`
--

INSERT INTO `searches` (`id`, `email`, `filter`, `query`, `sentListings`) VALUES
(1, 'fake@test.com', 'a:3:{s:3:"lat";d:38.94;s:3:"lng";d:-77.061186375;s:8:"distance";d:0.5;}', 'a:5:{s:5:"query";s:7:"dresser";s:6:"catAbb";s:3:"sss";s:4:"sort";s:3:"rel";s:6:"minAsk";i:10;s:6:"maxAsk";i:100;}', 'a:4:{i:0;s:10:"4431822656";i:1;s:10:"4422597369";i:2;s:10:"4432186313";i:3;s:10:"4429066179";}'),
(2, 'fake@test.com', 'a:3:{s:8:"distance";s:3:"0.2";s:3:"lat";d:38.9428410000000013724275049753487110137939453125;s:3:"lng";d:-77.061185999999992191078490577638149261474609375;}', 'a:3:{s:6:"catAbb";s:3:"sss";s:4:"sort";s:3:"rel";s:5:"query";s:7:"my+test";}', 'a:0:{}');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
