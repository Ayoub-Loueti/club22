-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : mar. 11 juin 2024 à 01:29
-- Version du serveur : 10.4.28-MariaDB
-- Version de PHP : 8.1.17

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `club22`
--

-- --------------------------------------------------------

--
-- Structure de la table `activite`
--

CREATE TABLE `activite` (
  `id_activite` int(11) NOT NULL,
  `id_offre` int(11) NOT NULL,
  `programme` text DEFAULT NULL,
  `inclus` text DEFAULT NULL,
  `duree` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `activite`
--

INSERT INTO `activite` (`id_activite`, `id_offre`, `programme`, `inclus`, `duree`) VALUES
(1, 43, '<p>visitez: <a href=\"https://www.solaris-bateaux.com/fr/excursions/c-itineraire-midday-break\">Solaris Bateaux</a></p>\r\n<p>Un d&eacute;jeuner &agrave; bord de SOLARIS, l\'aventure vous tente!</p>\r\n<h3>ITIN&Eacute;RAIRE MIDDAY BREAK / 01h30</h3>\r\n<p><img style=\"height: auto;\" src=\"https://www.solaris-bateaux.com/images/solaris/img-2.jpg\" alt=\"\" width=\"570\" height=\"624\"></p>\r\n<p><strong>Dur&eacute;e</strong>&nbsp;:&nbsp;De 13h00 &agrave; 14h30</p>\r\n<p><strong>P&eacute;riode</strong>&nbsp;:&nbsp;Vendredi / Samedi / Dimanche&nbsp;&nbsp;</p>\r\n<p><strong>Prix&nbsp;</strong>:</p>\r\n<p>55 dt/Adulte - 35dt/Enfant (de 02- 06 ans)&nbsp;</p>\r\n<p><a href=\"https://www.solaris-bateaux.com/as_code/selecteurdate/\">R&Eacute;SERVER MAINTENANT</a>R&eacute;servation et paiement au plus tard la veille.&nbsp;</p>\r\n<p><strong>Composition du box adulte:&nbsp;</strong>deux barres de granula, une brochette crevettes pan&eacute;es, deux brochettes poulet pan&eacute;e et popcorn de poulet pan&eacute;, barquette Chich Tawek (01 viande et 02 poulet), barquette de salade vari&eacute;e au gruy&egrave;re avec ses sauces, deux petits pains (blanc et aux c&eacute;r&eacute;ales), mousse de fromage au citron, mini-citronnade, eau et caf&eacute;.&nbsp;&nbsp;</p>\r\n<p><strong>Composition du box enfant:&nbsp;</strong>deux barres de granula, une brochette poulet pan&eacute; et cinq popcorn de poulet pan&eacute;s, frites, une barquette Chich Tawek (01 viande et 02 poulet), barquette de salade vari&eacute;e au gruy&egrave;re avec ses sauces, deux petits pains (blanc et aux c&eacute;r&eacute;ales), mousse de fromage au citron, mini-citronnade, eau et caf&eacute;.&nbsp;</p>\r\n<p><strong><em>&Agrave; savoir avant de partir&nbsp;:&nbsp;</em></strong>&nbsp;</p>\r\n<ul>\r\n<li aria-level=\"1\">Point de d&eacute;part et retour : Station Lacustre Solaris - Lac1</li>\r\n<li aria-level=\"1\">Arriv&eacute; avant 15 minutes du d&eacute;part&nbsp;</li>\r\n<li aria-level=\"1\">Il est strictement interdit d&rsquo;apporter de boissons et aliments &agrave; bord du bateau</li>\r\n<li>Il est strictement interdit de fumer &agrave; bord du bateau&nbsp;</li>\r\n<li>les enfants moins de 02 ans sont interdits &agrave; bord</li>\r\n<li>Les animaux sont interdits &agrave; bord&nbsp;</li>\r\n<li aria-level=\"1\">Interdiction des chaussures &agrave; talons aiguilles et &agrave; bout pointu pour les femmes.&nbsp;</li>\r\n<li>Vous devez &ecirc;tre muni de votre billet &eacute;lectronique</li>\r\n<li>Les bagages souples sont pr&eacute;f&eacute;rables, l\'espace de rangement sur le bateau &eacute;tant limit&eacute;</li>\r\n</ul>\r\n<div><strong>&nbsp;<span id=\"journeeentiere\">Conditions d&acute;annulation :</span></strong></div>\r\n<ul>\r\n<li>Les balades sont report&eacute;es &agrave; une date convenable au client et selon les disponibilit&eacute;s ou rembours&eacute;es &agrave; 100% lors d&rsquo;une annulation d&ucirc; au mauvais temps.&nbsp;</li>\r\n</ul>', 'Eau  \r\nSnack ', 1);

-- --------------------------------------------------------

--
-- Structure de la table `admin`
--

CREATE TABLE `admin` (
  `id_admin` int(11) NOT NULL,
  `id_utilisateur` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `client`
--

CREATE TABLE `client` (
  `id_client` int(11) NOT NULL,
  `id_utilisateur` int(11) NOT NULL,
  `points` int(11) NOT NULL,
  `derniereAddition` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `client`
--

INSERT INTO `client` (`id_client`, `id_utilisateur`, `points`, `derniereAddition`) VALUES
(6, 47, 45, '2024-06-10 00:01:35'),
(8, 50, 30, '2024-05-29 12:02:34'),
(10, 52, 10, '2024-04-27 23:49:23'),
(17, 59, 0, NULL),
(19, 61, 0, NULL),
(20, 66, 10, '2024-06-04 21:29:39'),
(21, 67, 0, NULL),
(22, 68, 0, NULL),
(23, 69, 0, NULL),
(24, 70, 0, NULL),
(25, 71, 0, NULL),
(26, 72, 0, NULL),
(27, 73, 10, '2024-06-04 21:06:21');

-- --------------------------------------------------------

--
-- Structure de la table `collaborateur`
--

CREATE TABLE `collaborateur` (
  `id_collaborateur` int(11) NOT NULL,
  `nom` varchar(255) NOT NULL,
  `type` varchar(255) NOT NULL,
  `adresse` varchar(255) NOT NULL,
  `tel` varchar(20) NOT NULL,
  `email` varchar(255) NOT NULL,
  `siteWeb` varchar(255) DEFAULT NULL,
  `logo` varchar(255) DEFAULT NULL,
  `archiver` tinyint(1) NOT NULL,
  `validation` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `collaborateur`
--

INSERT INTO `collaborateur` (`id_collaborateur`, `nom`, `type`, `adresse`, `tel`, `email`, `siteWeb`, `logo`, `archiver`, `validation`) VALUES
(2, 'Travel Todo', 'Agence de voyage', 'Charguia II - 2035 TUNIS ', '70103103', 'respcarthage@traveltodo.com', 'www.traveltodo.com', 'uploads/1711766115706.png', 0, '2024-05-16 11:44:22'),
(6, 'Tunisie Booking', 'Agence de voyages', 'Houmet Souk Djerba', '71124124', 'contact@tunisiebooking.com', 'tn.tunisiebooking.com', 'uploads/1711987428873.png', 0, NULL),
(18, 'safari voyages', 'Agence de voyage', ' Lafayette - Tunis', '71860050', 'galaxy@safarivoyages.tn', 'www.safarivoyages.tn', 'uploads/1711984819395.png', 0, NULL),
(27, 'Solaris Bateau du Lac', 'Service de location de bateaux à Tunis', 'Cheikh Zayed, Tunis 1053', '71960983', 'ayoub.loueti1@gmail.com', '', 'uploads/1713735207901.jpg', 0, '2024-06-11 15:41:41'),
(35, 'rania', 'voyage agency', 'tunis', '58275564', 'Benalirania855@gmail.com', 'rania.com', 'uploads/1717517857950.webp', 0, '2024-06-05 16:18:03');

-- --------------------------------------------------------

--
-- Structure de la table `commentaires`
--

CREATE TABLE `commentaires` (
  `id_cmntr` int(11) NOT NULL,
  `cmntr` varchar(300) NOT NULL,
  `id_post` int(11) NOT NULL,
  `date_cmntr` datetime NOT NULL,
  `id_utilisateur` int(11) NOT NULL,
  `nbr_likeCom` int(11) NOT NULL,
  `semaineCom` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `commentaires`
--

INSERT INTO `commentaires` (`id_cmntr`, `cmntr`, `id_post`, `date_cmntr`, `id_utilisateur`, `nbr_likeCom`, `semaineCom`) VALUES
(115, 'Oui je confirme Agence qui  correcte', 183, '2024-05-07 00:14:16', 47, 2, 2),
(116, 'J\'ai adoré les photos !!', 184, '2024-05-07 00:19:20', 34, 3, 3),
(123, 'Wow !!', 188, '2024-06-04 21:07:59', 73, 0, 0),
(124, 'Vraiment un trop beau pays', 184, '2024-06-04 21:09:43', 73, 0, 0),
(125, 'Les photos et les personnes me font vomir ; ils sont moches.', 184, '2024-06-04 21:12:35', 66, 0, 0),
(126, 'Mon hotel préféré', 215, '2024-06-04 21:30:49', 69, 0, 0);

-- --------------------------------------------------------

--
-- Structure de la table `demande`
--

CREATE TABLE `demande` (
  `id_demande` int(11) NOT NULL,
  `id_employe` int(11) NOT NULL,
  `titre` varchar(200) NOT NULL,
  `date_demande` datetime NOT NULL,
  `signature` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `demande`
--

INSERT INTO `demande` (`id_demande`, `id_employe`, `titre`, `date_demande`, `signature`) VALUES
(15, 1, 'devenir un adherant', '2024-04-24 23:02:05', 'data:image/png;base64,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'),
(19, 3, 'devenir un adherant', '2024-05-07 11:01:12', 'data:image/png;base64,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');

-- --------------------------------------------------------

--
-- Structure de la table `discussion`
--

CREATE TABLE `discussion` (
  `id_disc` int(11) NOT NULL,
  `nomDisc` varchar(255) NOT NULL,
  `typeDisc` enum('temporaire','infini') NOT NULL,
  `nbr_jours_disc` int(11) DEFAULT NULL,
  `date_fin` date DEFAULT NULL,
  `ispublic` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `discussion`
--

INSERT INTO `discussion` (`id_disc`, `nomDisc`, `typeDisc`, `nbr_jours_disc`, `date_fin`, `ispublic`) VALUES
(2, 'Club22', 'infini', NULL, NULL, 1),
(12, 'aaaaaa', 'temporaire', 3, '2024-06-13', 0);

-- --------------------------------------------------------

--
-- Structure de la table `employe`
--

CREATE TABLE `employe` (
  `id_employe` int(11) NOT NULL,
  `id_utilisateur` int(11) NOT NULL,
  `adherant` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `employe`
--

INSERT INTO `employe` (`id_employe`, `id_utilisateur`, `adherant`) VALUES
(1, 27, 1),
(2, 49, 0),
(3, 34, 1),
(4, 47, 0),
(5, 66, 0),
(6, 67, 1),
(7, 68, 1),
(8, 69, 0),
(9, 70, 0),
(10, 71, 0),
(11, 72, 1);

-- --------------------------------------------------------

--
-- Structure de la table `enregistrement`
--

CREATE TABLE `enregistrement` (
  `id_save` int(11) NOT NULL,
  `id_post` int(11) NOT NULL,
  `id_utilisateur` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `enregistrement`
--

INSERT INTO `enregistrement` (`id_save`, `id_post`, `id_utilisateur`) VALUES
(38, 184, 34),
(44, 187, 50),
(45, 214, 66),
(46, 215, 69);

-- --------------------------------------------------------

--
-- Structure de la table `evaluation`
--

CREATE TABLE `evaluation` (
  `id_evaluation` int(11) NOT NULL,
  `id_offre` int(11) NOT NULL,
  `id_employe` int(11) NOT NULL,
  `vote` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `grandhotel`
--

CREATE TABLE `grandhotel` (
  `id_grandHotel` int(11) NOT NULL,
  `id_offre` int(11) NOT NULL,
  `nom_hotel` varchar(255) NOT NULL,
  `etoiles` int(11) NOT NULL,
  `climatisation` tinyint(1) NOT NULL,
  `wifi` tinyint(1) NOT NULL,
  `piscine_exterieure` tinyint(1) NOT NULL,
  `piscine_couverte` tinyint(1) NOT NULL,
  `bassin_enfants` tinyint(1) NOT NULL,
  `parking` tinyint(1) NOT NULL,
  `discotheque` tinyint(1) NOT NULL,
  `plage_privee` tinyint(1) NOT NULL,
  `ascenseur` tinyint(1) NOT NULL,
  `salle_de_sport` tinyint(1) NOT NULL,
  `aire_de_jeux_enfants` tinyint(1) NOT NULL,
  `spa` tinyint(1) DEFAULT 0,
  `sauna` tinyint(1) DEFAULT 0,
  `hammam` tinyint(1) DEFAULT 0,
  `thalasso` tinyint(1) DEFAULT 0,
  `centre_esthetique` tinyint(1) DEFAULT 0,
  `toboggan` tinyint(1) DEFAULT 0,
  `pieds_dans_l_eau` tinyint(1) DEFAULT 0,
  `piscine_eau_de_mer` tinyint(1) DEFAULT 0,
  `baby_setting` tinyint(1) DEFAULT 0,
  `tennis_de_table` tinyint(1) DEFAULT 0,
  `location_de_voiture` tinyint(1) DEFAULT 0,
  `change_monetaire` tinyint(1) DEFAULT 0,
  `interdit_celibataires` tinyint(1) NOT NULL,
  `interdit_burkini` tinyint(1) NOT NULL,
  `interdit_alcohol` tinyint(1) NOT NULL,
  `logement_seulement` tinyint(1) DEFAULT 0,
  `prix_logement_seulement` float DEFAULT 0,
  `Petit_dejeuner` tinyint(1) DEFAULT 0,
  `prix_Petit_dejeuner` float DEFAULT 0,
  `demi_pension` tinyint(1) DEFAULT 0,
  `prix_demi_pension` float DEFAULT 0,
  `demi_pension_plus` tinyint(1) DEFAULT 0,
  `prix_demi_pension_plus` float DEFAULT 0,
  `pension_complete` tinyint(1) DEFAULT 0,
  `prix_pension_complete` float DEFAULT 0,
  `pension_complete_plus` tinyint(1) DEFAULT 0,
  `prix_pension_complete_plus` float DEFAULT 0,
  `all_inclusive` tinyint(1) DEFAULT 0,
  `prix_all_inclusive` float DEFAULT 0,
  `all_inclusive_soft` tinyint(1) DEFAULT 0,
  `prix_all_inclusive_soft` float DEFAULT 0,
  `pensiondefault` enum('logement_seulement','petit_dejeuner','demi_pension','demi_pension_plus','pension_complete','pension_complete_plus','all_inclusive','all_inclusive_soft') DEFAULT 'logement_seulement'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `grandhotel`
--

INSERT INTO `grandhotel` (`id_grandHotel`, `id_offre`, `nom_hotel`, `etoiles`, `climatisation`, `wifi`, `piscine_exterieure`, `piscine_couverte`, `bassin_enfants`, `parking`, `discotheque`, `plage_privee`, `ascenseur`, `salle_de_sport`, `aire_de_jeux_enfants`, `spa`, `sauna`, `hammam`, `thalasso`, `centre_esthetique`, `toboggan`, `pieds_dans_l_eau`, `piscine_eau_de_mer`, `baby_setting`, `tennis_de_table`, `location_de_voiture`, `change_monetaire`, `interdit_celibataires`, `interdit_burkini`, `interdit_alcohol`, `logement_seulement`, `prix_logement_seulement`, `Petit_dejeuner`, `prix_Petit_dejeuner`, `demi_pension`, `prix_demi_pension`, `demi_pension_plus`, `prix_demi_pension_plus`, `pension_complete`, `prix_pension_complete`, `pension_complete_plus`, `prix_pension_complete_plus`, `all_inclusive`, `prix_all_inclusive`, `all_inclusive_soft`, `prix_all_inclusive_soft`, `pensiondefault`) VALUES
(3, 34, 'Village Africa Jade Thalasso', 4, 1, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 'logement_seulement'),
(4, 35, 'El Ksar Resort & Thalasso ', 5, 1, 1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 'logement_seulement'),
(5, 36, 'club La Playa', 3, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 'logement_seulement'),
(6, 37, 'Hafsi', 3, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 'logement_seulement'),
(7, 38, 'Steigenberger Marhaba Thalasso ', 5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 'logement_seulement'),
(8, 39, 'Djerba Sun Beach', 3, 1, 1, 1, 0, 1, 0, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 'logement_seulement'),
(47, 88, 'Hotel Amber El Fell', 3, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 30, 0, 0, 0, 0, 0, 0, 1, 50, 0, 0, 'petit_dejeuner'),
(48, 89, 'CC', 19, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 'logement_seulement'),
(49, 93, 'azerty', 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 'logement_seulement');

-- --------------------------------------------------------

--
-- Structure de la table `hachtag`
--

CREATE TABLE `hachtag` (
  `id_hachtag` int(11) NOT NULL,
  `hachtag` varchar(200) NOT NULL,
  `id_post` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `hachtag`
--

INSERT INTO `hachtag` (`id_hachtag`, `hachtag`, `id_post`) VALUES
(12, 'TravelToDo', 183),
(13, 'VoyageuseSophie', 184),
(14, 'EgypteInoubliablev', 184),
(15, 'MarcEtMarieThalasso', 185),
(16, 'ElKsarDjerba', 185),
(17, 'SarahVoyageTurquie', 188),
(18, 'ArtEtHistoire', 188),
(24, 'SkyDiving', 214),
(25, 'Aventure', 214),
(26, 'SensationsFortes', 214),
(27, 'Adrenaline', 214);

-- --------------------------------------------------------

--
-- Structure de la table `hotel`
--

CREATE TABLE `hotel` (
  `id_hotel` int(11) NOT NULL,
  `nbr_adults` int(11) NOT NULL,
  `nbr_enfants` int(11) NOT NULL,
  `prix` float NOT NULL,
  `id_reservation` int(11) NOT NULL,
  `typechambreR` enum('Chambre standard','Chambre double','Chambre familiale','Chambre communicante','Suite','Suite royale') DEFAULT NULL,
  `vue` enum('simple','mer','piscine') DEFAULT 'simple',
  `pension` enum('logement_seulement','petit_dejeuner','demi_pension','demi_pension_plus','pension_complete','pension_complete_plus','all_inclusive','all_inclusive_soft') DEFAULT 'logement_seulement'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `hotel`
--

INSERT INTO `hotel` (`id_hotel`, `nbr_adults`, `nbr_enfants`, `prix`, `id_reservation`, `typechambreR`, `vue`, `pension`) VALUES
(57, 2, 0, 693, 120, NULL, 'simple', 'logement_seulement'),
(58, 1, 0, 91, 123, NULL, 'simple', 'logement_seulement'),
(59, 1, 0, 344, 125, NULL, 'simple', 'logement_seulement'),
(60, 1, 0, 344, 126, NULL, 'simple', 'logement_seulement'),
(61, 2, 1, 318.72, 127, NULL, 'simple', 'logement_seulement'),
(62, 1, 0, 346.5, 128, NULL, 'simple', 'logement_seulement'),
(63, 1, 0, 86.45, 131, NULL, 'simple', 'logement_seulement'),
(64, 1, 0, 309.6, 133, NULL, 'simple', 'logement_seulement'),
(65, 1, 0, 346.5, 134, NULL, 'simple', 'logement_seulement'),
(83, 2, 0, 372.6, 154, 'Chambre double', 'simple', 'petit_dejeuner');

-- --------------------------------------------------------

--
-- Structure de la table `image`
--

CREATE TABLE `image` (
  `id_image` int(11) NOT NULL,
  `pathImage` varchar(200) NOT NULL,
  `id_post` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `image`
--

INSERT INTO `image` (`id_image`, `pathImage`, `id_post`) VALUES
(54, 'uploads\\photos-1715041123880.jpg', 184),
(55, 'uploads\\photos-1715041123880.png', 184),
(56, 'uploads\\photos-1715041123902.jpg', 184),
(57, 'uploads\\photos-1715041357987.jpg', 185),
(58, 'uploads\\photos-1715041357996.jpg', 185),
(59, 'uploads\\photos-1715042044599.mp4', 188),
(63, 'uploads\\photos-1717535251369.jpg', 214),
(64, 'uploads\\photos-1717535251370.jpg', 214),
(65, 'uploads\\photos-1717536579350.jpg', 215);

-- --------------------------------------------------------

--
-- Structure de la table `imageoffre`
--

CREATE TABLE `imageoffre` (
  `id_imageOffre` int(11) NOT NULL,
  `id_offre` int(11) NOT NULL,
  `image` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `imageoffre`
--

INSERT INTO `imageoffre` (`id_imageOffre`, `id_offre`, `image`) VALUES
(81, 34, 'uploads\\01049ea3719dd6dd7f546e3759180e00'),
(82, 34, 'uploads\\16ce2d776190714ec8e48316843d9f96'),
(83, 34, 'uploads\\200fb2e84c843e1a4ffb5c3383c36e4e'),
(84, 34, 'uploads\\b44267ae65beddfc1ebe97f9c292f23e'),
(85, 35, 'uploads\\b57bd4e43d519e630821fa95763a99ce'),
(86, 35, 'uploads\\3d870b6e271ea64523a9f8cbbf6d7c04'),
(87, 35, 'uploads\\7bf5b3c22b2aef25dfc778f1cadd0b0b'),
(88, 35, 'uploads\\82f87a6989cc8167beb572322a0b2197'),
(89, 36, 'uploads\\1e12bb24946949f6525240dc15ce8d5b'),
(90, 36, 'uploads\\e623537c4c93683935b1ee65427b8bd5'),
(91, 36, 'uploads\\2ef7912b0f1c520a6072b3b5cfcfc9e6'),
(92, 37, 'uploads\\eba94488542ad4d0b3477733946dec3c'),
(93, 37, 'uploads\\20a3a8cab4f7087636617035694fd1d7'),
(94, 37, 'uploads\\408422426b7f71d42b13912c0ea1069e'),
(95, 37, 'uploads\\94659391bb0d09e7f4120916883a7025'),
(96, 38, 'uploads\\7cffa8af079b6de7f1ed039f11671364'),
(97, 38, 'uploads\\efc1256f9ac4f839985d621e7adc6957'),
(98, 38, 'uploads\\e2dda60092f9998243c809a83a25e5af'),
(99, 38, 'uploads\\abe941f2473e486131f1dc1f3d2496fc'),
(100, 39, 'uploads\\aa4166ba7bf8d083a8577504121a8714'),
(101, 39, 'uploads\\0eb3cfcda7e4a74d46e6a4e0f6f05a39'),
(102, 39, 'uploads\\94c7911173a9cb4ed6f5da5e383c4d62'),
(103, 40, 'uploads\\e4797257a49a89affbebfb37edc99103'),
(104, 40, 'uploads\\ac3dcedbdb6ef48ae9c4b20bf78c708a'),
(105, 40, 'uploads\\473c564d9480549b004f15e57b486083'),
(106, 40, 'uploads\\0aaf8a8c144eed196c8abbd912b66d5c'),
(107, 41, 'uploads\\f91a5e3890848b9b08663b92f7011df9'),
(108, 41, 'uploads\\4a81877c153cca6206840a29010b5955'),
(109, 41, 'uploads\\ab90e5052d54c2d013ce1e7877bbc4a9'),
(110, 41, 'uploads\\a8f371041bd8fad0056d00ecd3118fe3'),
(111, 42, 'uploads\\b4226e043fd5039b2ec1ec788da44abf'),
(112, 42, 'uploads\\e3408ae6ff6a8871a7ebdf2491f400a0'),
(113, 42, 'uploads\\31f1756c8bf7b322d262f0ef51da1a86'),
(114, 42, 'uploads\\0e7e94b4384dce1441c7c7f75f8bcd1f'),
(115, 43, 'uploads\\5c5626a5146923fa26973ad09ae53ae8'),
(116, 43, 'uploads\\014d307cb945cbecd658d95c5a7e2d4c'),
(117, 43, 'uploads\\3d50696c93261a1636de89115222971a'),
(153, 88, 'uploads\\6cce4719da2ec3b92bc4d27d95a255b6'),
(154, 88, 'uploads\\9b2dca4f05ef8f56f9e191879814deb3'),
(155, 89, 'uploads\\7c4429a888e197ee8ae75efafdf544f4'),
(159, 93, 'uploads\\5e90c06638a9a662cc687ea34175d6b5');

-- --------------------------------------------------------

--
-- Structure de la table `likecom`
--

CREATE TABLE `likecom` (
  `id_likeCom` int(11) NOT NULL,
  `id_cmntr` int(11) NOT NULL,
  `id_utilisateur` int(11) NOT NULL,
  `date_likeCom` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `likecom`
--

INSERT INTO `likecom` (`id_likeCom`, `id_cmntr`, `id_utilisateur`, `date_likeCom`) VALUES
(75, 116, 47, '2024-05-07 00:19:27'),
(76, 115, 50, '2024-05-07 00:22:47'),
(77, 116, 50, '2024-05-07 00:23:05'),
(78, 116, 49, '2024-05-07 00:26:46'),
(80, 115, 73, '2024-06-04 21:07:42');

-- --------------------------------------------------------

--
-- Structure de la table `likerep`
--

CREATE TABLE `likerep` (
  `id_likeRep` int(11) NOT NULL,
  `id_reponse` int(11) NOT NULL,
  `id_utilisateur` int(11) NOT NULL,
  `date_likeRep` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `likes`
--

CREATE TABLE `likes` (
  `id_like` int(11) NOT NULL,
  `id_post` int(11) NOT NULL,
  `id_utilisateur` int(11) NOT NULL,
  `date_like` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `likes`
--

INSERT INTO `likes` (`id_like`, `id_post`, `id_utilisateur`, `date_like`) VALUES
(138, 183, 47, '2024-05-07 00:13:58'),
(139, 184, 34, '2024-05-07 00:19:06'),
(140, 184, 47, '2024-05-07 00:19:28'),
(141, 183, 50, '2024-05-07 00:22:45'),
(142, 184, 50, '2024-05-07 00:23:00'),
(143, 185, 50, '2024-05-07 00:23:08'),
(144, 183, 49, '2024-05-07 00:26:41'),
(145, 187, 49, '2024-05-07 00:26:53'),
(146, 188, 34, '2024-05-07 00:34:51'),
(152, 183, 73, '2024-06-04 21:07:43'),
(153, 184, 73, '2024-06-04 21:07:46'),
(154, 185, 73, '2024-06-04 21:07:48'),
(155, 187, 73, '2024-06-04 21:07:50'),
(156, 188, 73, '2024-06-04 21:07:51'),
(157, 214, 66, '2024-06-04 21:10:28'),
(158, 188, 66, '2024-06-04 21:10:30'),
(159, 187, 66, '2024-06-04 21:10:32'),
(160, 184, 66, '2024-06-04 21:10:34'),
(161, 215, 73, '2024-06-04 21:30:11'),
(162, 215, 69, '2024-06-04 21:30:30'),
(163, 214, 69, '2024-06-04 21:30:32');

-- --------------------------------------------------------

--
-- Structure de la table `membre`
--

CREATE TABLE `membre` (
  `id_membre` int(11) NOT NULL,
  `id_discussion` int(11) NOT NULL,
  `id_utilisateur` int(11) NOT NULL,
  `isAdmin` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `membre`
--

INSERT INTO `membre` (`id_membre`, `id_discussion`, `id_utilisateur`, `isAdmin`) VALUES
(7, 12, 61, 1),
(9, 12, 67, 0),
(10, 12, 34, 0);

-- --------------------------------------------------------

--
-- Structure de la table `mention`
--

CREATE TABLE `mention` (
  `id_mention` int(11) NOT NULL,
  `id_post` int(11) NOT NULL,
  `id_collaborateur` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `messages`
--

CREATE TABLE `messages` (
  `id_msg` int(11) NOT NULL,
  `contenu` varchar(255) NOT NULL,
  `id_utilisateur` int(11) DEFAULT NULL,
  `id_disc` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `messages`
--

INSERT INTO `messages` (`id_msg`, `contenu`, `id_utilisateur`, `id_disc`) VALUES
(6, 'hii', 34, 2),
(20, 'aaa', 61, 12),
(21, 'aa', 61, 12),
(22, '55', 61, 12),
(23, 'za', 61, 12),
(24, '5', 61, 12),
(25, '6', 27, 12),
(26, '6', 27, 12);

-- --------------------------------------------------------

--
-- Structure de la table `notifications`
--

CREATE TABLE `notifications` (
  `id_notif` int(11) NOT NULL,
  `id_post` int(11) NOT NULL,
  `notifier` varchar(210) NOT NULL,
  `id_reponse` int(11) NOT NULL,
  `isRead` tinyint(1) NOT NULL DEFAULT 0,
  `id_own_post` int(11) NOT NULL,
  `id_utilisateur` int(11) NOT NULL,
  `date_notif` datetime NOT NULL,
  `id_cmntr` int(11) NOT NULL,
  `id_like` int(11) NOT NULL,
  `id_notifier` int(11) NOT NULL,
  `type` enum('comment','like') NOT NULL,
  `id_likeCom` int(11) NOT NULL,
  `id_likeRep` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `notifications`
--

INSERT INTO `notifications` (`id_notif`, `id_post`, `notifier`, `id_reponse`, `isRead`, `id_own_post`, `id_utilisateur`, `date_notif`, `id_cmntr`, `id_like`, `id_notifier`, `type`, `id_likeCom`, `id_likeRep`) VALUES
(303, 188, 'a aimé votre publication', 0, 0, 49, 34, '2024-05-07 00:34:51', 0, 146, 49, 'like', 0, 0),
(310, 183, 'a aimé votre commentaire', 0, 0, 34, 73, '2024-06-04 21:07:42', 115, 0, 47, 'like', 80, 0),
(311, 183, 'a aimé votre publication', 0, 0, 34, 73, '2024-06-04 21:07:43', 0, 152, 34, 'like', 0, 0),
(313, 185, 'a aimé votre publication', 0, 0, 50, 73, '2024-06-04 21:07:48', 0, 154, 50, 'like', 0, 0),
(314, 187, 'a aimé votre publication', 0, 0, 50, 73, '2024-06-04 21:07:50', 0, 155, 50, 'like', 0, 0),
(315, 188, 'a aimé votre publication', 0, 0, 49, 73, '2024-06-04 21:07:51', 0, 156, 49, 'like', 0, 0),
(316, 188, 'a commenté votre publication', 0, 0, 49, 73, '2024-06-04 21:07:59', 123, 0, 49, 'comment', 0, 0),
(320, 214, 'a aimé votre publication', 0, 0, 73, 66, '2024-06-04 21:10:28', 0, 157, 73, 'like', 0, 0),
(321, 188, 'a aimé votre publication', 0, 0, 49, 66, '2024-06-04 21:10:30', 0, 158, 49, 'like', 0, 0),
(322, 187, 'a aimé votre publication', 0, 0, 50, 66, '2024-06-04 21:10:32', 0, 159, 50, 'like', 0, 0),
(325, 215, '10 points sont ajoutés à votre boutique', 0, 0, 66, 66, '2024-06-04 21:29:39', 0, 0, 66, '', 0, 0),
(326, 215, 'a aimé votre publication', 0, 0, 66, 73, '2024-06-04 21:30:11', 0, 161, 66, 'like', 0, 0),
(327, 215, 'a aimé votre publication', 0, 0, 66, 69, '2024-06-04 21:30:30', 0, 162, 66, 'like', 0, 0),
(328, 214, 'a aimé votre publication', 0, 0, 73, 69, '2024-06-04 21:30:32', 0, 163, 73, 'like', 0, 0),
(330, 215, 'a commenté votre publication', 0, 0, 66, 69, '2024-06-04 21:30:49', 126, 0, 66, 'comment', 0, 0);

-- --------------------------------------------------------

--
-- Structure de la table `notificationsprinttroix`
--

CREATE TABLE `notificationsprinttroix` (
  `id_notif` int(11) NOT NULL,
  `contenu` varchar(255) DEFAULT NULL,
  `id_utilisateur` int(11) DEFAULT NULL,
  `date_notif` datetime DEFAULT NULL,
  `type` enum('reservaccepte','reservrefuse','signal') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `notificationsprinttroix`
--

INSERT INTO `notificationsprinttroix` (`id_notif`, `contenu`, `id_utilisateur`, `date_notif`, `type`) VALUES
(1, 'Votre réservation a été refusée', 34, '2024-05-14 10:49:59', 'reservrefuse'),
(2, 'Votre réservation a été refusée', 49, '2024-05-14 18:38:49', 'reservrefuse'),
(3, 'Votre réservation a été refusée', 34, '2024-05-14 18:49:29', 'reservrefuse'),
(5, 'Votre réservation a été refusée', 34, '2024-05-14 19:45:02', 'reservrefuse'),
(6, 'Votre réservation a été refusée', 34, '2024-05-14 21:57:08', 'reservrefuse'),
(7, 'Votre réservation a été acceptée', 34, '2024-05-26 16:46:40', 'reservaccepte'),
(8, 'Votre réservation a été acceptée', 34, '2024-05-26 16:52:59', 'reservaccepte'),
(9, 'Votre réservation a été acceptée', 34, '2024-05-26 17:32:12', 'reservaccepte'),
(10, 'Votre réservation a été acceptée', 34, '2024-05-26 17:34:48', 'reservaccepte'),
(11, 'Votre réservation a été acceptée', 49, '2024-05-26 21:44:53', 'reservaccepte'),
(12, 'Votre réservation a été acceptée', 34, '2024-05-29 11:09:08', 'reservaccepte'),
(13, 'Votre publication a été supprimée par un administrateur.', 47, '2024-06-09 23:58:42', 'signal'),
(14, '5 points sont déduits de votre compte', 47, '2024-06-10 00:01:39', 'signal');

-- --------------------------------------------------------

--
-- Structure de la table `offre`
--

CREATE TABLE `offre` (
  `id_offre` int(11) NOT NULL,
  `titre` varchar(255) NOT NULL,
  `description` varchar(400) NOT NULL,
  `date_debut` date NOT NULL,
  `date_fin` date NOT NULL,
  `prix` float NOT NULL,
  `id_collaborateur` int(11) DEFAULT NULL,
  `remise` int(11) NOT NULL,
  `type` enum('voyage','hotel','activite','autre') NOT NULL DEFAULT 'autre',
  `destination` varchar(400) NOT NULL,
  `nombre_enfants_gratuits` int(11) DEFAULT 0,
  `age_limite_gratuite` int(11) DEFAULT 0,
  `prix_enfants_payants` float DEFAULT 0,
  `conditions_speciales_enfants` varchar(255) DEFAULT NULL,
  `enfants_autorises` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `offre`
--

INSERT INTO `offre` (`id_offre`, `titre`, `description`, `date_debut`, `date_fin`, `prix`, `id_collaborateur`, `remise`, `type`, `destination`, `nombre_enfants_gratuits`, `age_limite_gratuite`, `prix_enfants_payants`, `conditions_speciales_enfants`, `enfants_autorises`) VALUES
(34, 'Village Africa Jade Thalasso', ' le Village Africa Jade Thalasso, le premier hôtel de son genre en Tunisie. Un concept de vacances inédit dédié au tourisme tunisien', '2024-05-06', '2024-05-12', 344, 2, 0, 'hotel', 'Délégation Korba, Gouvernorat Nabeul, Tunisie', 0, 0, 0, NULL, NULL),
(35, 'El Ksar Resort & Thalasso ', 'EL Ksar Resort & Thalasso est l’hôtel qui vous offrira les plus beaux souvenirs, partez à la découverte de sublimes paysages et une sublime atmosphère de bord de mer. Profitez d’un cadre exceptionnel, avec un service digne des plus grands hôtels, pour un séjour d’exception au cœur de la ville de Sousse surnommée « la Perle du Sahel ».', '2024-05-20', '2024-05-26', 249, 2, 0, 'hotel', 'Sousse, Tunisie Station touristique', 0, 0, 0, NULL, NULL),
(36, 'Hotel club La Playa a petit PRIX!!', 'La Playa Hôtel Club Hammamet est recommandé pour les adultes seulement, exclusivement pour les plus de 16 ans (bien qu\'il puisse y avoir des enfants séjournant à l\'hôtel à certaines périodes) ce qui en fait l\'escapade romantique idéale pour les couples et les amis qui souhaitent profiter de tout ce que la Tunisie a à offrir.\r\n\r\nL\'hôtel est fier d’offrir des repas exquis et de la cuisine raffinée d', '2024-05-06', '2024-08-11', 154, 18, 0, 'hotel', 'Délégation Hammamet, Gouvernorat Nabeul, Tunisie', 0, 0, 0, NULL, NULL),
(37, 'Hafsi Hotel', 'Situé à 2 kilomètres de l\'aéroport international de Tozeur, l\'Hôtel Hafsi est également à la croisée des chemins des principales destinations touristiques du Sud Tunisien .\r\n\r\nVous pourrez résider dans l\'une des 140 chambres, toutes dotées de climatisation individuelle, de télévision par satellite, de téléphone et d\'une salle de bain avec baignoire.', '2024-05-13', '2024-05-26', 91, 18, 0, 'hotel', 'Gouvernorat Tozeur, Tunisie', 0, 0, 0, NULL, NULL),
(38, 'Steigenberger Marhaba ', 'L’hôtel Steigenberger Marhaba Thalasso est l\'établissement de luxe le plus récent de la firme RIU en Tunisie. Au bord d’une plage de sable fin, l’hôtel Steigenberger Marhaba Thalasso Hammamet promet un séjour de décontraction et de loisirs exceptionnels.', '2024-05-07', '2024-05-16', 495, 6, 0, 'hotel', 'Hammamet Sud ', 0, 0, 0, 'null', 0),
(39, 'Djerba Sun Beach', 'Djerba Sun Beach Hotel & Spa est un magnifique complexe au sein d’une palmeraie verdoyante, faisant contraste avec la simplicité et la blancheur de son architecture, offrant une vue extraordinaire de la mer et des terrains avoisinant et promettant un séjour transporteur et magique sur l’île des rêves– Djerba.', '2024-05-06', '2024-05-26', 247, 6, 0, 'hotel', 'Djerba ', 0, 0, 0, NULL, NULL),
(40, 'Istanbul Biancho Old City Voyages organisés', 'Départ en groupe à l\'hôtel\r\n\r\nBiancho Old City 4* \r\n\r\n07 Jours / 06 Nuits\r\n\r\nVia Turkish Airlines', '2024-05-06', '2024-05-30', 2060, 2, 0, 'voyage', 'Istanbul, Turquie', 0, 0, 0, NULL, NULL),
(41, 'Un séjour exceptionnel à Dubai & Abu Dhabi', 'Dubaï l’éblouissante ville emblématique des Émirats arabes unis, connue pour ses gratte-ciel modernes, ses centres commerciaux hors du commun, ses plages de sable fin et son ambiance cosmopolite. Elle offre une expérience de vie nocturne animée, des attractions telles que les îles artificielles Palm Jumeirah et des opportunités de shopping haut de gamme.', '2024-05-14', '2024-05-31', 3650, 18, 0, 'voyage', 'Dubai, Émirats arabes unis', 0, 0, 0, NULL, NULL),
(42, 'Des vacances incroyables au Luxor, Hurghada & Caire', 'Votre séjour en Égypte avec Egyptair s\'annonce passionnant et bien organisé, avec un itinéraire soigneusement planifié pour vous faire découvrir les merveilles de ce pays fascinant.\r\n\r\nProfitez de chaque instant de cette aventure égyptienne.', '2024-05-13', '2024-05-26', 4210, 6, 0, 'voyage', 'Egypte', 0, 0, 0, NULL, NULL),
(43, ' Embarquez pour une balade avec Solaris Bateaux !!', 'Personnaliser\r\nvotre excursion\r\nPOUR UN ÉVÉNEMENT PRIVÉ OU PROFESSIONNEL NOUS VOUS PROPOSONS DIFFÉRENTES FORMULES SELON VOS ATTENTES', '2024-05-06', '2024-05-24', 45, 27, 0, 'activite', 'Lac 1,Tunis', 0, 0, 0, NULL, NULL),
(88, 'Hotel Amber El Fell', 'Amber El Fell Hammamet est un hôtel très agréable avec son accueil chaleureux et ses chambres spacieux. Il possède une piscine à l\'extérieure, une plage privée avec un service de réception qui sont ouvert 24h/24, un restaurant, un bar et un court de tennis.', '2024-06-04', '2024-06-23', 350, 6, 10, 'hotel', 'Hammamet', 1, 2, 50, '', 1),
(89, 'cc', 'cc', '0000-00-00', '0000-00-00', 20, 2, 0, 'hotel', 'Îles Cocos, Australie', 0, 0, 0, '', 0),
(93, 'azerty', 'azerty', '2024-06-10', '2024-06-11', 2, 27, 2, 'hotel', '', 0, 0, 0, NULL, NULL);

-- --------------------------------------------------------

--
-- Structure de la table `post`
--

CREATE TABLE `post` (
  `id_post` int(11) NOT NULL,
  `contenu` varchar(600) NOT NULL,
  `date_post` datetime NOT NULL,
  `id_utilisateur` int(11) NOT NULL,
  `nbr_likes` int(11) NOT NULL,
  `type` enum('hotel','voyage','activite','autre') NOT NULL,
  `lieu` varchar(255) DEFAULT NULL,
  `SemaineLike` int(11) NOT NULL,
  `react` enum('coeur','haha','wow','feu','pff','pleur','dormir','fache','heart','fire','cry','sleep','angry') DEFAULT NULL,
  `ispoint` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `post`
--

INSERT INTO `post` (`id_post`, `contenu`, `date_post`, `id_utilisateur`, `nbr_likes`, `type`, `lieu`, `SemaineLike`, `react`, `ispoint`) VALUES
(183, 'J\'ai fait une résérvation avec Travel Todo et c\'etais top #TravelToDo', '2024-05-07 00:12:54', 34, 4, 'autre', '', 4, NULL, 0),
(184, 'Egypte au top , Rencontrez Sophie, une aventurière passionnée par l\'histoire et la culture égyptiennes. Elle a exploré les pyramides de Gizeh et les temples de Louxor, partageant ses découvertes et émotions au fil de son voyage. Suivez son récit captivant sur notre blog ! 🌍✈️ #VoyageuseSophie #EgypteInoubliablev', '2024-05-07 00:18:43', 47, 5, 'voyage', 'Egypte', 5, NULL, 0),
(185, 'Suivez les moments de détente et de bien-être de Marc et Marie à EL Ksar Resort & Thalasso à Djerba. Entre séances de spa, farniente au bord de la piscine et découvertes culinaires, ils nous font vivre leurs vacances de rêve sous le soleil tunisien. Rejoignez-les dans cette escapade ! 🌴🌞 #MarcEtMarieThalasso #ElKsarDjerba', '2024-05-07 00:22:38', 50, 2, 'hotel', 'Djerba', 2, NULL, 0),
(187, 'El Ksar Resort & Thalasso  vraiment c top ', '2024-05-07 00:25:15', 50, 3, 'hotel', '', 3, NULL, 0),
(188, 'Plongez dans les récits de voyage de Sarah en Turquie(c est etait Istanbul Biancho Old City Voyages organisés ) , une amoureuse de l\'art et de l\'histoire ancienne. De la visite d\'Istanbul aux paysages envoûtants de la Cappadoce, Sarah partage sa passion pour cette destination fascinante. Suivez son périple sur nos réseaux ! 🕌🌄 #SarahVoyageTurquie #ArtEtHistoire', '2024-05-07 00:34:04', 49, 3, 'voyage', 'Istanbul, Région de Marmara, Turquie', 3, NULL, 0),
(214, '🌟 Mon Expérience de Sky Diving ! 🌟  Salut à tous ! J\'ai enfin réalisé un de mes rêves ce week-end : le saut en parachute ! 🚀✨  L\'adrénaline, la chute libre et les paysages incroyables, c\'était juste magique ! 🌄  Lieu : Mahdia  Temps de chute libre : 1 minute  Si vous cherchez une expérience inoubliable, foncez ! Les moniteurs sont super pros et vous mettent à l\'aise dès le début.  Vous avez des questions ou des expériences à partager ? Dites-moi tout en commentaires ! 😎  #SkyDiving #Aventure #SensationsFortes #Adrenaline', '2024-06-04 21:07:31', 73, 2, 'activite', '', 2, 'feu', 0),
(215, '🌟 Mon Séjour Inoubliable au Mouradi Palace ! 🌟  Je viens de passer des vacances extraordinaires à l\'hôtel 4 étoiles Mouradi Palace à Sousse, Tunisie ! 🏝️✨  Ce que j\'ai aimé : ✔️ Chambres spacieuses avec vue sur la mer. ✔️ Plage privée magnifique et piscines à couper le souffle. ✔️ Personnel attentionné et service impeccable. ✔️ Restaurants délicieux avec une grande variété de plats.  Si vous cherchez un endroit pour des vacances de rêve, je vous recommande vivement le Mouradi Palace ! 😍🌴', '2024-06-04 21:29:39', 66, 2, 'hotel', ' Hammam Sousse', 2, '', 0),
(223, 'QQ', '2024-06-09 23:24:28', 27, 0, 'activite', '', 0, '', 0),
(224, 'a', '2024-06-09 23:24:31', 27, 0, 'activite', '', 0, '', 0),
(240, 'azezea', '2024-06-09 23:59:36', 47, 0, 'voyage', '', 0, '', 0);

-- --------------------------------------------------------

--
-- Structure de la table `reclamation`
--

CREATE TABLE `reclamation` (
  `id_reclamation` int(11) NOT NULL,
  `contenu` text NOT NULL,
  `id_employe` int(11) NOT NULL,
  `statut` enum('En attente','Traitée','Rejetée') NOT NULL DEFAULT 'En attente',
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `message_admin` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `reclamation`
--

INSERT INTO `reclamation` (`id_reclamation`, `contenu`, `id_employe`, `statut`, `createdAt`, `updatedAt`, `message_admin`) VALUES
(27, 'J\'ai réservé une balade en bateau avec Solaris, mais à mon arrivée, on m\'a informée que le bateau était complet, malgré ma réservation préalable.\nCela me semble peu professionnel de la part de Solaris et je suis déçue de ne pas avoir pu profiter de cette activité comme prévu.', 3, 'Traitée', '2024-06-04 21:36:41', '2024-06-04 21:40:10', 'Nous vous présentons nos excuses pour l\'incident lors de votre réservation avec Solaris. Nous travaillons à résoudre ce problème'),
(28, 'Je tiens à souligner l\'importance du traitement rapide des signalements sur notre plateforme. Il est essentiel de maintenir des normes élevées et un environnement respectueux pour tous.', 3, 'En attente', '2024-06-04 21:38:22', '2024-06-04 21:39:00', NULL);

-- --------------------------------------------------------

--
-- Structure de la table `reponse`
--

CREATE TABLE `reponse` (
  `id_reponse` int(11) NOT NULL,
  `contenu` varchar(255) NOT NULL,
  `id_cmntr` int(11) NOT NULL,
  `id_utilisateur` int(11) NOT NULL,
  `nbr_likeRep` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `reponse`
--

INSERT INTO `reponse` (`id_reponse`, `contenu`, `id_cmntr`, `id_utilisateur`, `nbr_likeRep`) VALUES
(128, 'Merci bcp', 116, 47, 0),
(129, 'oui c vrai ', 115, 50, 0),
(136, 'Moi aussi ', 116, 73, 0);

-- --------------------------------------------------------

--
-- Structure de la table `reservation`
--

CREATE TABLE `reservation` (
  `id_reservation` int(11) NOT NULL,
  `date_reservation` datetime DEFAULT current_timestamp(),
  `id_offre` int(11) DEFAULT NULL,
  `id_employe` int(11) DEFAULT NULL,
  `etat` enum('en_cours','confirmer','annuler','reparation','accepter','refuser') NOT NULL,
  `nombre` int(11) NOT NULL,
  `prix_totale` float NOT NULL,
  `typeR` enum('voyage','hotel','activité','autre') NOT NULL,
  `date_debut` date DEFAULT NULL,
  `date_fin` date DEFAULT NULL,
  `mode_paiement` enum('especes','deduction_salaire','paiement_en_ligne') DEFAULT NULL,
  `autorisation_deduction_salaire` tinyint(1) DEFAULT 0,
  `date_paiement` datetime DEFAULT current_timestamp(),
  `montant_deduit` float DEFAULT 0,
  `statut_paiement` enum('en_attente','accepte','refuse','paye_especes','payé') DEFAULT NULL,
  `months` enum('0','1','2','3','4','5','6','7','8') DEFAULT NULL,
  `nbr_enfants` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `reservation`
--

INSERT INTO `reservation` (`id_reservation`, `date_reservation`, `id_offre`, `id_employe`, `etat`, `nombre`, `prix_totale`, `typeR`, `date_debut`, `date_fin`, `mode_paiement`, `autorisation_deduction_salaire`, `date_paiement`, `montant_deduit`, `statut_paiement`, `months`, `nbr_enfants`) VALUES
(120, '2024-05-07 00:03:43', 38, 3, 'accepter', 1, 693, 'hotel', '2024-05-07', '2024-05-10', 'deduction_salaire', 1, '2024-05-07 00:03:43', 693, 'accepte', NULL, 0),
(121, '2024-05-07 00:04:50', 41, 3, 'accepter', 2, 7300, 'voyage', '2024-05-16', '2024-05-23', 'especes', 0, '2024-05-07 00:04:50', 7300, 'accepte', NULL, 0),
(122, '2024-05-07 00:10:42', 42, 3, 'accepter', 1, 4210, 'voyage', '2024-05-13', '2024-05-21', 'especes', 0, '2024-05-07 00:10:42', 4210, 'accepte', NULL, 0),
(123, '2024-05-07 00:36:41', 37, 2, 'refuser', 1, 91, 'hotel', '2024-05-19', '2024-05-21', 'deduction_salaire', 1, '2024-05-07 00:36:41', 91, 'refuse', NULL, 0),
(124, '2024-05-07 00:37:32', 41, 2, 'reparation', 1, 3650, 'voyage', '2024-05-14', '2024-05-21', 'especes', 0, '2024-05-07 00:37:32', 3650, 'accepte', NULL, 0),
(125, '2024-05-07 00:37:53', 34, 2, 'annuler', 1, 344, 'hotel', '2024-05-07', '2024-05-09', 'especes', 0, '2024-05-07 00:37:53', 344, 'paye_especes', NULL, 0),
(126, '2024-05-07 10:25:43', 34, 3, 'confirmer', 1, 344, 'hotel', '2024-05-07', '2024-05-09', 'deduction_salaire', 1, '2024-05-07 10:25:43', 344, 'accepte', NULL, 0),
(127, '2024-05-07 11:15:08', 35, 3, 'accepter', 1, 318.72, 'hotel', '2024-05-07', '2024-05-09', 'deduction_salaire', 1, '2024-05-07 11:15:08', 318.72, 'refuse', NULL, 0),
(128, '2024-05-07 18:24:39', 38, 3, 'refuser', 1, 1178.1, 'hotel', '2024-05-07', '2024-05-10', 'especes', 0, '2024-05-07 18:24:39', 346.5, 'refuse', NULL, 0),
(129, '2024-05-10 14:10:25', 43, 3, 'reparation', 1, 40.5, 'activité', '2024-05-09', '1970-01-01', 'especes', 0, '2024-05-10 14:10:25', 40.5, 'paye_especes', NULL, 0),
(130, '2024-05-10 16:34:25', 40, 3, 'reparation', 3, 6180, 'voyage', '2024-05-10', '2024-05-17', 'especes', 0, '2024-05-10 16:34:25', 6180, 'paye_especes', NULL, 0),
(131, '2024-05-14 10:59:21', 37, 3, 'reparation', 1, 86.45, 'hotel', '2024-05-14', '2024-05-16', 'especes', 0, '2024-05-14 10:59:21', 86.45, 'accepte', NULL, 0),
(133, '2024-05-14 20:17:24', 34, 3, 'confirmer', 1, 681.12, 'hotel', '2024-05-14', '2024-05-25', 'deduction_salaire', 1, '2024-05-14 20:17:24', 309.6, 'en_attente', NULL, 0),
(134, '2024-05-14 22:02:12', 38, 3, 'annuler', 1, 970.2, 'hotel', '2024-05-14', '2024-05-16', 'especes', 0, '2024-05-14 22:02:12', 346.5, 'paye_especes', NULL, 0),
(154, '2024-06-04 22:15:38', 88, 3, 'en_cours', 1, 372.6, 'hotel', '2024-06-04', '2024-06-22', 'deduction_salaire', 1, '2024-06-04 22:15:38', 372.6, 'en_attente', '1', 0);

-- --------------------------------------------------------

--
-- Structure de la table `signaler`
--

CREATE TABLE `signaler` (
  `id_signaler` int(11) NOT NULL,
  `id_post` int(11) NOT NULL,
  `id_utilisateur` int(11) NOT NULL,
  `id_cmntr` int(11) NOT NULL,
  `id_reponse` int(11) NOT NULL,
  `isRead` tinyint(1) NOT NULL,
  `isOpen` tinyint(1) NOT NULL,
  `cause` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `signaler`
--

INSERT INTO `signaler` (`id_signaler`, `id_post`, `id_utilisateur`, `id_cmntr`, `id_reponse`, `isRead`, `isOpen`, `cause`) VALUES
(30, 184, 69, 125, 0, 0, 1, 'Incitation à la haine'),
(31, 184, 73, 125, 0, 0, 1, 'Contenu violent, s\'il vous plaît traiter le signal très rapidement'),
(32, 183, 73, 0, 0, 1, 1, 'Spam ou publicité');

-- --------------------------------------------------------

--
-- Structure de la table `typechambre`
--

CREATE TABLE `typechambre` (
  `id_TypeChambre` int(11) NOT NULL,
  `id_grandhotel` int(11) NOT NULL,
  `nom` enum('Chambre standard','Chambre double','Chambre familiale','Chambre communicante','Suite','Suite royale') NOT NULL,
  `supplement` float DEFAULT 0,
  `defaultChambre` tinyint(1) DEFAULT NULL,
  `single` tinyint(1) NOT NULL DEFAULT 0,
  `prixsingle` int(11) NOT NULL DEFAULT 0,
  `vuemer` tinyint(1) NOT NULL DEFAULT 0,
  `supplementmer` int(11) NOT NULL DEFAULT 0,
  `vuepis` tinyint(1) NOT NULL DEFAULT 0,
  `supplementpis` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `typechambre`
--

INSERT INTO `typechambre` (`id_TypeChambre`, `id_grandhotel`, `nom`, `supplement`, `defaultChambre`, `single`, `prixsingle`, `vuemer`, `supplementmer`, `vuepis`, `supplementpis`) VALUES
(31, 47, 'Chambre standard', 0, 1, 1, 47, 1, 30, 1, 20),
(32, 47, 'Chambre double', 34, 0, 1, 18, 0, 0, 0, 0),
(33, 47, 'Suite', 130, 0, 0, 0, 0, 0, 0, 0),
(34, 48, 'Suite royale', 19, 0, 0, 0, 0, 0, 0, 0),
(35, 48, 'Chambre communicante', 5, 0, 0, 0, 0, 0, 0, 0),
(36, 48, 'Chambre standard', 0, 1, 1, 9, 0, 0, 0, 0),
(37, 48, 'Suite', 9, 0, 0, 0, 0, 0, 0, 0),
(38, 49, 'Chambre standard', 0, 1, 1, 5, 0, 0, 0, 0),
(39, 49, 'Chambre double', 55, 0, 0, 0, 0, 0, 0, 0);

-- --------------------------------------------------------

--
-- Structure de la table `utilisateur`
--

CREATE TABLE `utilisateur` (
  `id_utilisateur` int(11) NOT NULL,
  `nom` varchar(200) NOT NULL,
  `prenom` varchar(200) NOT NULL,
  `email` varchar(200) NOT NULL,
  `motDePasse` varchar(200) NOT NULL,
  `photo` varchar(200) NOT NULL,
  `genre` enum('homme','femme','inconnu') NOT NULL DEFAULT 'inconnu',
  `type` enum('client','employe','admin') NOT NULL,
  `etat` enum('En attente','autorise','bloque') NOT NULL,
  `resetPasswordToken` varchar(200) NOT NULL,
  `resetPasswordExpires` datetime DEFAULT NULL,
  `description` varchar(200) NOT NULL DEFAULT '''Loading...!''',
  `loginAttempts` int(11) NOT NULL DEFAULT 0,
  `lockUntil` datetime DEFAULT NULL,
  `nbr_notifs` int(11) NOT NULL,
  `faceDescriptors` text DEFAULT NULL,
  `tel` varchar(255) DEFAULT NULL,
  `blockSignalUntil` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `utilisateur`
--

INSERT INTO `utilisateur` (`id_utilisateur`, `nom`, `prenom`, `email`, `motDePasse`, `photo`, `genre`, `type`, `etat`, `resetPasswordToken`, `resetPasswordExpires`, `description`, `loginAttempts`, `lockUntil`, `nbr_notifs`, `faceDescriptors`, `tel`, `blockSignalUntil`) VALUES
(3, 'Lahbib', 'Noura', 'admin@admin', '$2b$10$E6wr.2D7m7lRIW.XO/aBz.wJdXRS.g8WmW1aT2.a49lgFiDjWG6EW', '', 'homme', 'admin', 'autorise', '3670', '2024-05-29 12:15:23', 'Profil en cours de personnalisation!', 0, NULL, 0, NULL, '22111333', NULL),
(27, 'Louati', 'Ayoub', 'ayoub.loueti1@gmail.com', '$2b$10$fTqfevlCuaFoFXT2R0chPevGU5LpDDkq8FFQbRZyBCz/YsDVYoLsG', 'uploads\\photo-1711464305753.jpg', 'homme', 'employe', 'autorise', '9446', '2024-05-03 16:55:59', '', 0, NULL, 0, NULL, '22993665', NULL),
(34, 'Benali', 'Rania', 'benalirania855@gmail.com', '', 'uploads\\photo-1714641172228.jpg', 'femme', 'employe', 'autorise', '', '0000-00-00 00:00:00', '', 0, '2024-03-05 00:00:00', 2, NULL, '58275564', '2024-05-26'),
(47, 'ayoub', 'loueti', 'ayoub.nightraid123@gmail.com', '$2b$10$ULzjhxBQMBsRGRaBoFSVFuHaDveIkN2t8zN.htdBryTYjpY5uo2oO', 'uploads\\photo-1711447296780.jpg', 'homme', 'employe', 'autorise', '1821', '2024-03-26 11:00:28', 'Profil en cours de personnalisation!', 0, NULL, 0, NULL, '22456771', NULL),
(49, 'nasr', 'taher', 'nasrmohammedtaher01@gmail.com', '$2b$10$uBCIbp7wwTDMBm72OKeXZ.eWj8aJIMTAovUjZewDlj75hqLF96OzO', 'uploads\\photo-1711670324364.png', 'homme', 'employe', 'autorise', '4852', '2024-03-29 00:55:30', 'Profil en cours de personnalisation!', 0, NULL, 8, NULL, '22445332', NULL),
(50, 'Khemiri', 'hakim', 'hakimkhemeri326@gmail.com', '$2b$10$5vcceITHnUtcPD5Ythf56udoHh3fXXJa.J94wt614PoVpHHSy78Ha', 'uploads\\photo-1718033018782.png', 'homme', 'client', 'autorise', '6872', '2024-03-29 01:00:28', 'Profil en cours de personnalisation!', 0, NULL, 4, NULL, '20339866', NULL),
(52, 'Eya', 'Akkari', 'akkeriaya345@gmail.com', '$2b$10$VwWm.bmhH5OEeH4EQiaqa.1WBTrCzVs3nZTZvXMCK3.F7stHzEElC', 'uploads\\photo-1718032431014.jpg', 'femme', 'client', 'autorise', '', NULL, 'Profil en cours de personnalisation!', 0, NULL, 0, NULL, '54337653', NULL),
(59, 'Serij', 'Salwa', 'salwa@gmail.com', '$2b$10$KJ2iQMs1JwbV57d57DKw4em.7grqV3fPYpWMUaLE16.c9OSC4gneW', '', 'femme', 'client', 'En attente', '7652', '2024-05-14 12:04:28', 'Profil en cours de personnalisation!', 0, '0000-00-00 00:00:00', 0, NULL, '58274749', NULL),
(61, 'AdminClub22 ', 'Ooredoo', 'ooredooclub@gmail.com', '$2b$10$u7ckn/8HYWXNKm6H4.NqYO4t43WRaPLkG5x2dmnagbCngnyo/NKpi', 'uploads\\photo-1717513754369.png', 'homme', 'admin', 'autorise', '8987', '2024-06-04 16:07:46', 'Profil en cours de personnalisation!', 0, NULL, 0, NULL, '22111444', NULL),
(66, 'manai', 'rahma', 'manairahmaclub22@gmail.com', '$2b$10$dTtaK8xesy2TtqEEWxKW4OuKMGdsxAN38yAj9PoVNwuzD2h.nH8Ty', 'uploads\\photo-1717515083868.jpg', 'femme', 'employe', 'autorise', '3585', '2024-06-04 16:24:24', 'Profil en cours de personnalisation!', 0, NULL, 4, NULL, '22846098', NULL),
(67, 'yahyeoui', 'ones', 'yahyeouionesclub22@gmail.com', '$2b$10$H7BeorntG6VD0A1ctL.19.syNT5D8GWpudZgYZaYTaNFyMezFewfO', 'uploads\\photo-1717516293912.jpg', 'femme', 'employe', 'autorise', '4448', '2024-06-04 16:49:17', 'Profil en cours de personnalisation!', 0, NULL, 0, NULL, '22135732', NULL),
(68, 'lahbibi', 'hiba', 'LahbibihibaClub22@gmail.com', '$2b$10$89zry9rIxccHn8omF9y2sOOW3tUJTMtDwY/OOmGwqIzdpjfLyTwIa', 'uploads\\photo-1717516657281.jpg', 'femme', 'employe', 'autorise', '3741', '2024-06-04 16:56:31', 'Profil en cours de personnalisation!', 0, NULL, 0, NULL, '221134567', NULL),
(69, 'melliti', 'mahe', 'MellitmaheClub22@gmail.com', '$2b$10$WlJ7o2k8epY.w.EfliRtIuEmVFtegAtFsGipc6sViDsDWE.kcGrEO', 'uploads\\photo-1717516847808.jpg', 'femme', 'employe', 'autorise', '8372', '2024-06-04 17:00:35', 'Profil en cours de personnalisation!', 0, NULL, 0, NULL, '22987532', NULL),
(70, 'mekni', 'rayen', 'meknirayenClub22@gmail.com', '$2b$10$HNxQpblzSiTg1x9jCUXvBeaIWX/uB3xnwfqPV..6XF1sgvtxnXYcq', 'uploads\\photo-1718032903691.jpg', 'homme', 'employe', 'autorise', '', NULL, 'Profil en cours de personnalisation!', 0, NULL, 0, NULL, '22123567', NULL),
(71, 'hamdi', 'aziz', 'hamdiazizClub22@gmail.com', '$2b$10$qUCUZkf/I2IullcXMC6XX.OjstdQ63B.7Lywet9kJA9SK8wgiRmby', 'uploads\\photo-1718033931286.jpg', 'homme', 'employe', 'autorise', '3833', '2024-06-04 17:04:59', 'Profil en cours de personnalisation!', 0, NULL, 0, NULL, '22098652', NULL),
(72, 'challouati', 'yassine', 'challouatiyassineClub22@gmail.com', '$2b$10$zetnk.PcX3hjCZruUKP7KuhUMx9pjeyXu.Tzh11vb.wHlrg5CztNi', 'uploads\\photo-1718032604739.jpg', 'homme', 'employe', 'autorise', '2053', '2024-06-04 17:05:29', 'Profil en cours de personnalisation!', 0, NULL, 0, NULL, '22116522', NULL),
(73, 'Ouni', 'ones', 'onesouni@gmail.com', '$2b$10$XGGs3PecrwficPQzYmcEB.4O6TKibyvDVtOSWAhBB7npSeafNdk4C', 'uploads\\photo-1717534854137.png', 'femme', 'client', 'autorise', '3483', '2024-06-04 21:58:04', 'Profil en cours de personnalisation!', 0, NULL, 3, NULL, '53221665', NULL);

--
-- Déclencheurs `utilisateur`
--
DELIMITER $$
CREATE TRIGGER `new_client_trigger` AFTER INSERT ON `utilisateur` FOR EACH ROW BEGIN
    IF NEW.type = 'client' THEN
        INSERT INTO client (id_utilisateur)
        VALUES (NEW.id_utilisateur);
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Structure de la table `voyage`
--

CREATE TABLE `voyage` (
  `id_voyage` int(11) NOT NULL,
  `id_offre` int(11) NOT NULL,
  `programme` text DEFAULT NULL,
  `inclus` text DEFAULT NULL,
  `nbr_jours` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `voyage`
--

INSERT INTO `voyage` (`id_voyage`, `id_offre`, `programme`, `inclus`, `nbr_jours`) VALUES
(7, 40, '<p><strong>Jour 1 : Tunis / Istanbul :</strong></p>\r\n<p>Arriv&eacute;e &agrave; l\'a&eacute;roport d\'Istanbul. Accueil et transfert &agrave; l\'h&ocirc;tel.</p>\r\n<p>&nbsp;</p>\r\n<p><strong>Jour 2 : Eyup Tour&nbsp;(&nbsp;en extra ) :</strong></p>\r\n<p>Petit d&eacute;jeuner &agrave; l\'h&ocirc;tel, d&eacute;part en excursion&nbsp;:</p>\r\n<p>La journ&eacute;e d&eacute;bute l&agrave; o&ugrave; l\'on peut admirer la symbolique&nbsp;ey&uuml;psultan&nbsp;mosqu&eacute;e dans&nbsp;le quartier Eyup d\'Istanbul, du c&ocirc;t&eacute; europ&eacute;en de la ville. Ensuite, direction Pierlotti&nbsp;portant le nom d\'un &eacute;crivain fran&ccedil;ais et ancien r&eacute;sident d\'Istanbul qui a une vue sur la Corne d\'Or.&nbsp;Poursuivant le tour au Venezia Mall ou Olivyoum Mall pour les fanatiques du shopping &ccedil;a fera leur bonheur avec la panoplie de choix qu\'ils auront.</p>\r\n<p><strong>Jour 3 :&nbsp;Les &icirc;les des Princesses&nbsp;(&nbsp;en extra ) :</strong></p>\r\n<p>Petit d&eacute;jeuner &agrave; l\'h&ocirc;tel, d&eacute;part en excursion&nbsp;:</p>\r\n<p>C\'est l\'occasion de s\'&eacute;vader de l\'agitation de la ville pour d&eacute;couvrir un groupe d\'&icirc;les pittoresques situ&eacute;es en mer de Marmara. Ces &icirc;les, appel&eacute;es \"Princes\' Islands\" en anglais, offrent un charme unique avec leurs rues pav&eacute;es, leurs maisons en bois color&eacute;es, leurs jardins luxuriants et leur ambiance paisible. L\'excursion typique implique une croisi&egrave;re en ferry depuis Istanbul pour atteindre l\'une des principales &icirc;les, comme B&uuml;y&uuml;kada, o&ugrave; vous pourrez explorer &agrave; v&eacute;lo, en cal&egrave;che ou &agrave; pied, d&eacute;guster des fruits de mer frais dans les restaurants locaux, visiter des &eacute;glises historiques et profiter de superbes vues panoramiques sur la mer. Les Princess Islands sont un havre de tranquillit&eacute;, sans voitures, ce qui en fait une &eacute;chappatoire id&eacute;ale pour une journ&eacute;e de d&eacute;tente hors de la ville anim&eacute;e d\'Istanbul.</p>\r\n<p><strong>Jour 4 :&nbsp;Sapanca &amp; Masukiye&nbsp;(&nbsp;en extra ) :</strong></p>\r\n<p>Petit d&eacute;jeuner &agrave; l\'h&ocirc;tel, d&eacute;part en excursion</p>\r\n<p>La route commence &agrave; Istanbul et m&egrave;ne &agrave; Sapanca, une destination paisible situ&eacute;e pr&egrave;s d\'un magnifique lac. &Agrave; Sapanca, on peut profiter d\'une vue panoramique sur le lac, faire du v&eacute;lo autour de ses rives ou simplement se d&eacute;tendre dans la nature paisible. Ensuite, on se dirige vers Masukiye, un petit village nich&eacute; dans les montagnes, o&ugrave; l\'on peut d&eacute;guster des plats traditionnels turcs dans des restaurants locaux pittoresques. Les cascades de Masukiye offrent une pause rafra&icirc;chissante, et les sentiers de randonn&eacute;e permettent d\'explorer la beaut&eacute; naturelle de la r&eacute;gion. Ce circuit offre une escapade parfaite de la ville vers la tranquillit&eacute; de Sapanca et l\'authenticit&eacute; de Masukiye, offrant une exp&eacute;rience m&eacute;morable dans la nature.</p>\r\n<p><strong>Jour 5 : Istanbul journ&eacute;e Libre :</strong></p>\r\n<p>Petit d&eacute;jeuner &agrave; l&rsquo;h&ocirc;tel, journ&eacute;e libre pour la d&eacute;couverte de la ville.&nbsp;</p>\r\n<p><strong>Jour 6 : Istanbul journ&eacute;e Libre :</strong></p>\r\n<p>Petit d&eacute;jeuner &agrave; l&rsquo;h&ocirc;tel, journ&eacute;e libre pour la d&eacute;couverte de la ville.</p>\r\n<p><strong>Jour 7 : Istanbul/Tunis :</strong></p>\r\n<p>Petit d&eacute;jeuner &agrave; l\'h&ocirc;tel. Selon l&rsquo;horaire du vol, transfert vers l&rsquo;a&eacute;roport d\'Istanbul.</p>\r\n<p><strong>NB.&nbsp;: L&rsquo;ordre des excursions peut varier selon certaines conditions.</strong></p>\r\n<p>&nbsp;</p>\r\n<p>Tarif TTC du package &agrave; l\'h&ocirc;tel Biancho Old City 4* (ou similaire) :</p>\r\n<p>Par personne dans une chambre double : 1717 DT</p>\r\n<p>Par personne dans une chambre triple : 1717 DT</p>\r\n<p>Chambre Single : 2460 DT</p>\r\n<p>Tarif enfant partageant la chambre avec 02 adultes :</p>\r\n<p>B&eacute;b&eacute; - de 2 ans : 200 DT</p>\r\n<p>Enfant de 02-5 ans : 1280 DT (il partage le lit des parents)</p>\r\n<p>Enfant de 6-11 ans : 1388 DT&nbsp;</p>\r\n<p><strong><span style=\"box-sizing: border-box; text-decoration: underline;\">Tarif des excursions en extra&nbsp;: 335 DT</span></strong></p>', '-Le billet d’avion Tunis / Istanbul / Tunis via Turkish Airlines                         - Le Transfert Aéroport / Hôtel / Aéroport.\r\n- 06 nuits à l\'hôtel Biancho Old City 4* en logement et petit déjeuner.\r\n\r\n- Mise à la Disposition Bus durant les transferts', 7),
(8, 41, '<p><span style=\"text-decoration: underline; color: #ba372a;\"><strong>City tour &agrave; Duba&iuml; :</strong></span></p>\r\n<p>Petit-d&eacute;jeuner &agrave; l&rsquo;h&ocirc;tel, puis d&eacute;part pour une visite de la ville moderne de Duba&iuml;. L\'itin&eacute;raire comprend des sites c&eacute;l&egrave;bres tels que la crique de Duba&iuml;, la mosqu&eacute;e Jumeirah, le Burj Al Arab, l\'Atlantis the Palm, le Burj Khalifa, la plage de Jumeirah, Madinat Jumeirah et Sheikh Zayed Road. La visite offrira un regard sur le pass&eacute;, le pr&eacute;sent et le futur de Duba&iuml;, des sites historiques &agrave; l\'architecture moderne.</p>\r\n<p>Par la suite on se dirigera vers la zone de la marina, et on se rendra au fameux centre commercial &laquo; Duba&iuml; mall &raquo; pour visiter le plus grand aquarium suspendu du monde</p>\r\n<p>&laquo;<span style=\"background-color: #fbeeb8;\"> Duba&iuml; aquarium</span> 🦈&raquo; (extra ), Burj Khalifah (extra ) et voir l\'incontournable spectacle de la c&eacute;l&egrave;bre fontaine de Duba&iuml; ,</p>\r\n<p>Retour &agrave; l\'h&ocirc;tel.</p>\r\n<p><span style=\"color: #f8cac6;\"><strong>En extra :</strong></span></p>\r\n<ul type=\"disc\">\r\n<li>Burj Khalifah &eacute;tage 124 ticket d\'entr&eacute;e @ 45 USD par personne</li>\r\n<li>Le billet d\'exploration de la zone sous-marine de l\'Aquarium Duba&iuml; Mall @28 USD par personne</li>\r\n</ul>\r\n<p>&nbsp;</p>\r\n<p><strong>Full day Abu Dhabi City Tour:</strong></p>\r\n<p>Petit-d&eacute;jeuner &agrave; l&rsquo;h&ocirc;tel. Notre visite commence par explorer les points forts d\'Abou Dhabi ; Admirer les ic&ocirc;nes architecturales telles que l\'Emirates Palace et la mosqu&eacute;e Sheik Zayed et d&eacute;couvrir les traditions ancestrales de la ville en passant par Heritage Village ; (temps libre pour le d&eacute;jeuner dans un restaurant local, d&eacute;jeuner en extra).</p>\r\n<p>La derni&egrave;re partie de la visite est consacr&eacute;e au projet g&eacute;ant Saadiyat Island situ&eacute; au nord- est d\'Abu Dhabi, l&rsquo;ile repr&eacute;sente l\'un des hauts lieux touristiques et culturels &eacute;mergents de la ville. Couvrant 27 kilom&egrave;tres carr&eacute;s, elle basse se caract&eacute;rise par des centres culturels ultramodernes, tel que le mus&eacute;e du Louvre et les mus&eacute;es Guggenheim. Nous terminons notre visite par l\'&icirc;le de Yas, le foyer de la&nbsp;<strong>Formule 1&nbsp;</strong>Yas Marina Circuit, et le premier parc d\'attractions Ferrari dans le monde.</p>\r\n<p>Retour &agrave; l\'h&ocirc;tel &agrave; Duba&iuml;.</p>\r\n<p><strong>En extra :</strong></p>\r\n<ul type=\"disc\">\r\n<li>Qasr al-Hosn est un monument historique ; Plus ancienne structure encore existante d\'Abu Dhabi@ 9 $ par personne</li>\r\n<li>Qasr Al Watan ; le palais pr&eacute;sidentiel des Emirats Arabes Unis @14 $/par personne</li>\r\n</ul>\r\n<p>&nbsp;</p>\r\n<p><strong>Full Day Miracle Garden &amp; Global Village :</strong></p>\r\n<p>Petit D&eacute;jeuner &agrave; l\'h&ocirc;tel puis d&eacute;part pour d&eacute;couvrir une combinaison unique des plus belles attractions de DUBAI. Notre tour commence par la visite du Miracle Garden qui est un jardin fleuri situ&eacute; dans le quartier de Dubailand. Le jardin a &eacute;t&eacute; inaugur&eacute; le jour de la Saint-Valentin en 2013. Il occupe plus de 72 000 m&egrave;tres carr&eacute;s ce qui en fait le plus grand jardin de fleurs naturelles au monde, avec plus de 50 millions de fleurs et 250 millions de plantes sans oublier le Duba&iuml; Butterfly Garden, le plus grand jardin de papillons int&eacute;rieur au monde et le premier sanctuaire de la r&eacute;gion pour plus de 15 000 papillons de 26 esp&egrave;ces. Apr&egrave;s on continue vers le Global Village Duba&iuml; qui est une zone de divertissements culturels nocturnes form&eacute;e de pavillons de plus de 40 pays qui visent &agrave; pr&eacute;senter leurs cultures gr&acirc;ce aux spectacles et produits locaux typiques.</p>\r\n<div>&nbsp;</div>\r\n<p><strong>Tarif TTC du package &agrave; l\'h&ocirc;tel Golden Tulip Media 4* (ou similaire) :</strong></p>\r\n<p>Par personne dans une chambre double : 3490 DT</p>\r\n<p>3&egrave;me personne en chambre triple : 3290 DT</p>\r\n<p>Chambre Single : 4650 DT</p>\r\n<p>Tarif enfant partageant la chambre avec 02 adultes :</p>\r\n<p>B&eacute;b&eacute; - de 2 ans : 390 DT</p>\r\n<p>Enfant de 02- 05 ans : 1850 DT (il partage le lit des parents)</p>\r\n<p>&nbsp;</p>\r\n<p>Enfant de 05-12 ans : 2790 DT</p>\r\n<p>&nbsp;</p>\r\n<p><strong>Non inclus dans le tarif :</strong></p>\r\n<p>-&nbsp;<span style=\"font-family: \'Plus Jakarta Sans\', sans-serif; text-decoration: underline;\">Frais de visa:</span>&nbsp;340 DT par personne</p>\r\n<p>-&nbsp;<span style=\"font-family: \'Plus Jakarta Sans\', sans-serif; text-decoration: underline;\">Toursim Dirham Fees:</span>&nbsp;15 AED (+/- 4 USD selon le cours du jour) par chambre par nuit&eacute;e.&nbsp;<strong>* Ces taxes seront collect&eacute;es directement des clients lors du check-in.</strong></p>\r\n<p>- Assurance voyage (Obligatoire).</p>\r\n<p>&nbsp;</p>\r\n<p><span style=\"color: #e03e2d;\"><strong><span style=\"font-family: \'Plus Jakarta Sans\', sans-serif; text-decoration: underline;\">NOTE IMPORTANTE :&nbsp;</span></strong></span></p>\r\n<p>&nbsp;</p>\r\n<p>La troisi&egrave;me personne suppl&eacute;mentaire aura un lit d&rsquo;appoint.</p>\r\n<p>Un seul enfant peut partager la chambre avec deux adultes.</p>\r\n<p>L&rsquo;enfant de 5 &agrave; 11,99 ans aura un lit suppl&eacute;mentaire.</p>\r\n<p>Le tarif affich&eacute; pour l&rsquo;enfant de 2 &agrave; 4,99 ans est valable pour l&rsquo;enfant qui partage le lit avec ses parents.</p>\r\n<p>Un enfant de 12 ans sera consid&eacute;r&eacute; comme adulte.</p>\r\n<p>&nbsp;</p>\r\n<p><span style=\"text-decoration: underline;\"><strong>DETAILS DES VOLS :</strong>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</span> &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</p>\r\n<p>&nbsp;</p>\r\n<p><strong>EK&nbsp; 748 5FEB&nbsp; TUNDXB 14h55 23h30</strong></p>\r\n<p><strong>EK&nbsp; 747 11FEB DXBTUN 08h40 12h35</strong></p>\r\n<p>&nbsp;</p>\r\n<p><strong>PROCEDURE DE DEPOT DES VISAS :&nbsp;</strong></p>\r\n<ul>\r\n<li>Copie scann&eacute;e du Passeport format jpeg ou pdf</li>\r\n<li>Une photo d&rsquo;identit&eacute; scann&eacute;e en format jpeg ou pdf</li>\r\n<li>&nbsp;Validit&eacute; du passeport&nbsp;: Min 06 mois &agrave; partir de la date du d&eacute;part</li>\r\n</ul>', '- Billet d’avion TUNIS-DUBAI-TUNIS via Emirates.\r\n\r\n- Hébergement 6 nuitées en LPD à l’hôtel Golden Tulip Media 4*\r\n\r\n- City tour Dubaï.\r\n\r\n- Journée visite Abu-Dhabi.\r\n\r\n- Transferts Aéroport-Hôtel-Aéroport.', 7),
(9, 42, '<table style=\"border-collapse: collapse; width: 100%; height: 1002.4px;\" border=\"1\"><colgroup><col style=\"width: 33.0189%;\"><col style=\"width: 33.0189%;\"><col style=\"width: 33.0189%;\"></colgroup>\r\n<tbody>\r\n<tr style=\"height: 36px;\">\r\n<td><span style=\"background-color: #eccafa;\">JOUR</span></td>\r\n<td><span style=\"background-color: #eccafa;\">ACTIVITES</span></td>\r\n<td><span style=\"background-color: #eccafa;\">REPAS</span></td>\r\n</tr>\r\n<tr style=\"height: 202.4px;\">\r\n<td>1</td>\r\n<td>Arriv&eacute;e auCaire</td>\r\n<td>\r\n<p>D&icirc;ner dans un restaurant local pour d&eacute;couvrir la cuisine &eacute;gyptienne.</p>\r\n</td>\r\n</tr>\r\n<tr style=\"height: 314.4px;\">\r\n<td>2</td>\r\n<td>\r\n<p>Visite des pyramides de Gizeh, avec la Grande Pyramide de Kh&eacute;ops, le Sphinx et le temple de la Vall&eacute;e.</p>\r\n</td>\r\n<td>\r\n<p>D&eacute;jeuner dans un restaurant traditionnel.</p>\r\n</td>\r\n</tr>\r\n<tr style=\"height: 269.6px;\">\r\n<td>3</td>\r\n<td>\r\n<p>Visite de la citadelle de Saladin et de la mosqu&eacute;e de Mohamed Ali.</p>\r\n</td>\r\n<td>\r\n<p>D&eacute;jeuner dans un restaurant local.</p>\r\n</td>\r\n</tr>\r\n<tr style=\"height: 36px;\">\r\n<td>4</td>\r\n<td>\r\n<p>Embarquement sur une croisi&egrave;re sur le Nil avec d&eacute;jeuner &agrave; bord.</p>\r\n</td>\r\n<td>\r\n<p>D&icirc;ner et nuit &agrave; bord du bateau.</p>\r\n</td>\r\n</tr>\r\n<tr style=\"height: 36px;\">\r\n<td>5</td>\r\n<td>\r\n<p>Visite du temple d\'Hatchepsout, une structure spectaculaire construite dans la falaise.</p>\r\n</td>\r\n<td>\r\n<p>D&icirc;ner et nuit &agrave; bord.</p>\r\n</td>\r\n</tr>\r\n<tr style=\"height: 36px;\">\r\n<td>6</td>\r\n<td>\r\n<ul style=\"list-style-type: disc;\">\r\n<li>Visite du temple d\'Edfou, d&eacute;di&eacute; au dieu Horus.&nbsp; &nbsp; &nbsp;&nbsp;</li>\r\n<li>Navigation vers Kom Ombo avec d&eacute;jeuner &agrave; bord.</li>\r\n</ul>\r\n</td>\r\n<td>\r\n<p>Retour au bateau pour le d&icirc;ner et nuit &agrave; bord.</p>\r\n</td>\r\n</tr>\r\n<tr style=\"height: 36px;\">\r\n<td>7</td>\r\n<td>\r\n<p>Arriv&eacute;e au Caire et transfert &agrave; l\'h&ocirc;tel.</p>\r\n</td>\r\n<td>\r\n<p>Petit-d&eacute;jeuner &agrave; bord du bateau.</p>\r\n</td>\r\n</tr>\r\n<tr style=\"height: 36px;\">\r\n<td>8</td>\r\n<td>\r\n<ul style=\"list-style-type: disc;\">\r\n<li>Temps libre selon l\'heure du vol de d&eacute;part.</li>\r\n<li>Transfert &agrave; l\'a&eacute;roport pour le vol de retour.</li>\r\n</ul>\r\n</td>\r\n<td>\r\n<p>Petit-d&eacute;jeuner &agrave; l\'h&ocirc;tel.</p>\r\n</td>\r\n</tr>\r\n</tbody>\r\n</table>', 'Billet d’avion TUN-CAI-LUX // HRG-CAI // CAI-TUN via Egyptair selon les détails des vols ci-dessous\r\n\r\n1 nuitée à Luxor à l’hôtel Jolie Ville & SPA Kings Island 5* en Demi-Pension\r\n\r\n3 nuitées à Hurghada à l’hôtel Desert Rose Resort 5* en All in soft\r\n\r\n3 nuitées au Caire à l’hôtel Radisson Blu Cairo Heliopolis 4* en Logement et petit déjeuner', 8);

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `activite`
--
ALTER TABLE `activite`
  ADD PRIMARY KEY (`id_activite`),
  ADD KEY `fk_activite_offre` (`id_offre`);

--
-- Index pour la table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`id_admin`),
  ADD KEY `fk_admin_utilisateur` (`id_utilisateur`);

--
-- Index pour la table `client`
--
ALTER TABLE `client`
  ADD PRIMARY KEY (`id_client`),
  ADD KEY `fk_client_utilisateur` (`id_utilisateur`);

--
-- Index pour la table `collaborateur`
--
ALTER TABLE `collaborateur`
  ADD PRIMARY KEY (`id_collaborateur`);

--
-- Index pour la table `commentaires`
--
ALTER TABLE `commentaires`
  ADD PRIMARY KEY (`id_cmntr`),
  ADD KEY `fk_cmntr_utilisateur` (`id_utilisateur`),
  ADD KEY `fk_cmntr_post` (`id_post`);

--
-- Index pour la table `demande`
--
ALTER TABLE `demande`
  ADD PRIMARY KEY (`id_demande`),
  ADD KEY `fk_demande_employe` (`id_employe`);

--
-- Index pour la table `discussion`
--
ALTER TABLE `discussion`
  ADD PRIMARY KEY (`id_disc`);

--
-- Index pour la table `employe`
--
ALTER TABLE `employe`
  ADD PRIMARY KEY (`id_employe`),
  ADD KEY `fk_employe_utilisateur` (`id_utilisateur`);

--
-- Index pour la table `enregistrement`
--
ALTER TABLE `enregistrement`
  ADD PRIMARY KEY (`id_save`),
  ADD KEY `fk_enregistrement_post` (`id_post`),
  ADD KEY `fk_enregistrement_utilisateur` (`id_utilisateur`);

--
-- Index pour la table `evaluation`
--
ALTER TABLE `evaluation`
  ADD PRIMARY KEY (`id_evaluation`),
  ADD KEY `fk_evaluation_offre` (`id_offre`),
  ADD KEY `fk_evaluation_employe` (`id_employe`);

--
-- Index pour la table `grandhotel`
--
ALTER TABLE `grandhotel`
  ADD PRIMARY KEY (`id_grandHotel`),
  ADD KEY `fk_grandhotel_offre` (`id_offre`);

--
-- Index pour la table `hachtag`
--
ALTER TABLE `hachtag`
  ADD PRIMARY KEY (`id_hachtag`),
  ADD KEY `fk_hachtag_post` (`id_post`);

--
-- Index pour la table `hotel`
--
ALTER TABLE `hotel`
  ADD PRIMARY KEY (`id_hotel`),
  ADD KEY `fk_hotel_reservation` (`id_reservation`);

--
-- Index pour la table `image`
--
ALTER TABLE `image`
  ADD PRIMARY KEY (`id_image`),
  ADD KEY `fk_image_post_cascade` (`id_post`);

--
-- Index pour la table `imageoffre`
--
ALTER TABLE `imageoffre`
  ADD PRIMARY KEY (`id_imageOffre`),
  ADD KEY `fk_offre_imageOffre` (`id_offre`);

--
-- Index pour la table `likecom`
--
ALTER TABLE `likecom`
  ADD PRIMARY KEY (`id_likeCom`),
  ADD KEY `fk_likeCom_utilisateur` (`id_utilisateur`),
  ADD KEY `fk_likeCom_commentaires` (`id_cmntr`);

--
-- Index pour la table `likerep`
--
ALTER TABLE `likerep`
  ADD PRIMARY KEY (`id_likeRep`),
  ADD KEY `fk_likeRep_utilisateur` (`id_utilisateur`),
  ADD KEY `fk_likeRep_reponse` (`id_reponse`);

--
-- Index pour la table `likes`
--
ALTER TABLE `likes`
  ADD PRIMARY KEY (`id_like`),
  ADD KEY `fk_like_utilisateur` (`id_utilisateur`),
  ADD KEY `fk_like_post` (`id_post`);

--
-- Index pour la table `membre`
--
ALTER TABLE `membre`
  ADD PRIMARY KEY (`id_membre`),
  ADD KEY `fk_membre_discussion` (`id_discussion`),
  ADD KEY `fk_membre_utilisateur` (`id_utilisateur`);

--
-- Index pour la table `mention`
--
ALTER TABLE `mention`
  ADD PRIMARY KEY (`id_mention`),
  ADD KEY `fk_mention_post` (`id_post`),
  ADD KEY `fk_mention_collaborateur` (`id_collaborateur`);

--
-- Index pour la table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id_msg`),
  ADD KEY `fk_utilisateur_message` (`id_utilisateur`),
  ADD KEY `fk_discussion_message` (`id_disc`);

--
-- Index pour la table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id_notif`),
  ADD KEY `id_post` (`id_post`),
  ADD KEY `id_utilisateur` (`id_utilisateur`),
  ADD KEY `id_own_post` (`id_own_post`);

--
-- Index pour la table `notificationsprinttroix`
--
ALTER TABLE `notificationsprinttroix`
  ADD PRIMARY KEY (`id_notif`),
  ADD KEY `id_utilisateur` (`id_utilisateur`);

--
-- Index pour la table `offre`
--
ALTER TABLE `offre`
  ADD PRIMARY KEY (`id_offre`),
  ADD KEY `offre_ibfk_1` (`id_collaborateur`);

--
-- Index pour la table `post`
--
ALTER TABLE `post`
  ADD PRIMARY KEY (`id_post`),
  ADD KEY `fk_post_utilisateur` (`id_utilisateur`);

--
-- Index pour la table `reclamation`
--
ALTER TABLE `reclamation`
  ADD PRIMARY KEY (`id_reclamation`),
  ADD KEY `id_employe` (`id_employe`);

--
-- Index pour la table `reponse`
--
ALTER TABLE `reponse`
  ADD PRIMARY KEY (`id_reponse`),
  ADD KEY `fk_reponse_commentaires` (`id_cmntr`),
  ADD KEY `fk_reponse_utilisateur` (`id_utilisateur`);

--
-- Index pour la table `reservation`
--
ALTER TABLE `reservation`
  ADD PRIMARY KEY (`id_reservation`),
  ADD KEY `reservation_ibfk_1` (`id_offre`),
  ADD KEY `fk_reservation_employe` (`id_employe`);

--
-- Index pour la table `signaler`
--
ALTER TABLE `signaler`
  ADD PRIMARY KEY (`id_signaler`),
  ADD KEY `fk_signaler_post` (`id_post`),
  ADD KEY `fk_signaler_utilisateur` (`id_utilisateur`);

--
-- Index pour la table `typechambre`
--
ALTER TABLE `typechambre`
  ADD PRIMARY KEY (`id_TypeChambre`),
  ADD KEY `typechambre_ibfk_1` (`id_grandhotel`);

--
-- Index pour la table `utilisateur`
--
ALTER TABLE `utilisateur`
  ADD PRIMARY KEY (`id_utilisateur`);

--
-- Index pour la table `voyage`
--
ALTER TABLE `voyage`
  ADD PRIMARY KEY (`id_voyage`),
  ADD KEY `fk_voyage_offre` (`id_offre`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `activite`
--
ALTER TABLE `activite`
  MODIFY `id_activite` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `admin`
--
ALTER TABLE `admin`
  MODIFY `id_admin` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `client`
--
ALTER TABLE `client`
  MODIFY `id_client` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT pour la table `collaborateur`
--
ALTER TABLE `collaborateur`
  MODIFY `id_collaborateur` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT pour la table `commentaires`
--
ALTER TABLE `commentaires`
  MODIFY `id_cmntr` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=127;

--
-- AUTO_INCREMENT pour la table `demande`
--
ALTER TABLE `demande`
  MODIFY `id_demande` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT pour la table `discussion`
--
ALTER TABLE `discussion`
  MODIFY `id_disc` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT pour la table `employe`
--
ALTER TABLE `employe`
  MODIFY `id_employe` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT pour la table `enregistrement`
--
ALTER TABLE `enregistrement`
  MODIFY `id_save` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=47;

--
-- AUTO_INCREMENT pour la table `evaluation`
--
ALTER TABLE `evaluation`
  MODIFY `id_evaluation` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT pour la table `grandhotel`
--
ALTER TABLE `grandhotel`
  MODIFY `id_grandHotel` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=50;

--
-- AUTO_INCREMENT pour la table `hachtag`
--
ALTER TABLE `hachtag`
  MODIFY `id_hachtag` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT pour la table `hotel`
--
ALTER TABLE `hotel`
  MODIFY `id_hotel` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=84;

--
-- AUTO_INCREMENT pour la table `image`
--
ALTER TABLE `image`
  MODIFY `id_image` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=66;

--
-- AUTO_INCREMENT pour la table `imageoffre`
--
ALTER TABLE `imageoffre`
  MODIFY `id_imageOffre` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=160;

--
-- AUTO_INCREMENT pour la table `likecom`
--
ALTER TABLE `likecom`
  MODIFY `id_likeCom` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=81;

--
-- AUTO_INCREMENT pour la table `likerep`
--
ALTER TABLE `likerep`
  MODIFY `id_likeRep` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT pour la table `likes`
--
ALTER TABLE `likes`
  MODIFY `id_like` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=165;

--
-- AUTO_INCREMENT pour la table `membre`
--
ALTER TABLE `membre`
  MODIFY `id_membre` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT pour la table `mention`
--
ALTER TABLE `mention`
  MODIFY `id_mention` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=60;

--
-- AUTO_INCREMENT pour la table `messages`
--
ALTER TABLE `messages`
  MODIFY `id_msg` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT pour la table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id_notif` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=340;

--
-- AUTO_INCREMENT pour la table `notificationsprinttroix`
--
ALTER TABLE `notificationsprinttroix`
  MODIFY `id_notif` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT pour la table `offre`
--
ALTER TABLE `offre`
  MODIFY `id_offre` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=94;

--
-- AUTO_INCREMENT pour la table `post`
--
ALTER TABLE `post`
  MODIFY `id_post` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=242;

--
-- AUTO_INCREMENT pour la table `reclamation`
--
ALTER TABLE `reclamation`
  MODIFY `id_reclamation` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT pour la table `reponse`
--
ALTER TABLE `reponse`
  MODIFY `id_reponse` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=137;

--
-- AUTO_INCREMENT pour la table `reservation`
--
ALTER TABLE `reservation`
  MODIFY `id_reservation` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=155;

--
-- AUTO_INCREMENT pour la table `signaler`
--
ALTER TABLE `signaler`
  MODIFY `id_signaler` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT pour la table `typechambre`
--
ALTER TABLE `typechambre`
  MODIFY `id_TypeChambre` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;

--
-- AUTO_INCREMENT pour la table `utilisateur`
--
ALTER TABLE `utilisateur`
  MODIFY `id_utilisateur` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=74;

--
-- AUTO_INCREMENT pour la table `voyage`
--
ALTER TABLE `voyage`
  MODIFY `id_voyage` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `activite`
--
ALTER TABLE `activite`
  ADD CONSTRAINT `fk_activite_offre` FOREIGN KEY (`id_offre`) REFERENCES `offre` (`id_offre`) ON DELETE CASCADE;

--
-- Contraintes pour la table `admin`
--
ALTER TABLE `admin`
  ADD CONSTRAINT `fk_admin_utilisateur` FOREIGN KEY (`id_utilisateur`) REFERENCES `utilisateur` (`id_utilisateur`);

--
-- Contraintes pour la table `client`
--
ALTER TABLE `client`
  ADD CONSTRAINT `fk_client_utilisateur` FOREIGN KEY (`id_utilisateur`) REFERENCES `utilisateur` (`id_utilisateur`) ON DELETE CASCADE;

--
-- Contraintes pour la table `commentaires`
--
ALTER TABLE `commentaires`
  ADD CONSTRAINT `fk_cmntr_post_cascade` FOREIGN KEY (`id_post`) REFERENCES `post` (`id_post`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_cmntr_utilisateur` FOREIGN KEY (`id_utilisateur`) REFERENCES `utilisateur` (`id_utilisateur`);

--
-- Contraintes pour la table `demande`
--
ALTER TABLE `demande`
  ADD CONSTRAINT `fk_demande_employe` FOREIGN KEY (`id_employe`) REFERENCES `employe` (`id_employe`) ON DELETE CASCADE;

--
-- Contraintes pour la table `employe`
--
ALTER TABLE `employe`
  ADD CONSTRAINT `fk_employe_utilisateur` FOREIGN KEY (`id_utilisateur`) REFERENCES `utilisateur` (`id_utilisateur`) ON DELETE CASCADE;

--
-- Contraintes pour la table `enregistrement`
--
ALTER TABLE `enregistrement`
  ADD CONSTRAINT `fk_enregistrement_post` FOREIGN KEY (`id_post`) REFERENCES `post` (`id_post`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_enregistrement_utilisateur` FOREIGN KEY (`id_utilisateur`) REFERENCES `utilisateur` (`id_utilisateur`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `evaluation`
--
ALTER TABLE `evaluation`
  ADD CONSTRAINT `fk_evaluation_employe` FOREIGN KEY (`id_employe`) REFERENCES `reservation` (`id_employe`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_evaluation_offre` FOREIGN KEY (`id_offre`) REFERENCES `offre` (`id_offre`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `grandhotel`
--
ALTER TABLE `grandhotel`
  ADD CONSTRAINT `fk_grandhotel_offre` FOREIGN KEY (`id_offre`) REFERENCES `offre` (`id_offre`) ON DELETE CASCADE;

--
-- Contraintes pour la table `hachtag`
--
ALTER TABLE `hachtag`
  ADD CONSTRAINT `fk_hachtag_post` FOREIGN KEY (`id_post`) REFERENCES `post` (`id_post`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `hotel`
--
ALTER TABLE `hotel`
  ADD CONSTRAINT `fk_hotel_reservation` FOREIGN KEY (`id_reservation`) REFERENCES `reservation` (`id_reservation`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `image`
--
ALTER TABLE `image`
  ADD CONSTRAINT `fk_image_post_cascade` FOREIGN KEY (`id_post`) REFERENCES `post` (`id_post`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_post` FOREIGN KEY (`id_post`) REFERENCES `post` (`id_post`);

--
-- Contraintes pour la table `imageoffre`
--
ALTER TABLE `imageoffre`
  ADD CONSTRAINT `fk_offre_imageOffre` FOREIGN KEY (`id_offre`) REFERENCES `offre` (`id_offre`) ON DELETE CASCADE;

--
-- Contraintes pour la table `likecom`
--
ALTER TABLE `likecom`
  ADD CONSTRAINT `fk_likeCom_commentaires` FOREIGN KEY (`id_cmntr`) REFERENCES `commentaires` (`id_cmntr`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_likeCom_utilisateur` FOREIGN KEY (`id_utilisateur`) REFERENCES `utilisateur` (`id_utilisateur`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `likerep`
--
ALTER TABLE `likerep`
  ADD CONSTRAINT `fk_likeRep_reponse` FOREIGN KEY (`id_reponse`) REFERENCES `reponse` (`id_reponse`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_likeRep_utilisateur` FOREIGN KEY (`id_utilisateur`) REFERENCES `utilisateur` (`id_utilisateur`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `likes`
--
ALTER TABLE `likes`
  ADD CONSTRAINT `fk_like_post_cascade` FOREIGN KEY (`id_post`) REFERENCES `post` (`id_post`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_like_utilisateur` FOREIGN KEY (`id_utilisateur`) REFERENCES `utilisateur` (`id_utilisateur`);

--
-- Contraintes pour la table `membre`
--
ALTER TABLE `membre`
  ADD CONSTRAINT `fk_membre_discussion` FOREIGN KEY (`id_discussion`) REFERENCES `discussion` (`id_disc`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_membre_utilisateur` FOREIGN KEY (`id_utilisateur`) REFERENCES `utilisateur` (`id_utilisateur`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `mention`
--
ALTER TABLE `mention`
  ADD CONSTRAINT `fk_mention_collaborateur` FOREIGN KEY (`id_collaborateur`) REFERENCES `collaborateur` (`id_collaborateur`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_mention_post` FOREIGN KEY (`id_post`) REFERENCES `post` (`id_post`) ON DELETE CASCADE;

--
-- Contraintes pour la table `messages`
--
ALTER TABLE `messages`
  ADD CONSTRAINT `fk_discussion_message` FOREIGN KEY (`id_disc`) REFERENCES `discussion` (`id_disc`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_utilisateur_message` FOREIGN KEY (`id_utilisateur`) REFERENCES `utilisateur` (`id_utilisateur`) ON DELETE CASCADE;

--
-- Contraintes pour la table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`id_post`) REFERENCES `post` (`id_post`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `notifications_ibfk_2` FOREIGN KEY (`id_utilisateur`) REFERENCES `utilisateur` (`id_utilisateur`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `notifications_ibfk_3` FOREIGN KEY (`id_own_post`) REFERENCES `post` (`id_utilisateur`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `notificationsprinttroix`
--
ALTER TABLE `notificationsprinttroix`
  ADD CONSTRAINT `notificationsprinttroix_ibfk_1` FOREIGN KEY (`id_utilisateur`) REFERENCES `utilisateur` (`id_utilisateur`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `offre`
--
ALTER TABLE `offre`
  ADD CONSTRAINT `offre_ibfk_1` FOREIGN KEY (`id_collaborateur`) REFERENCES `collaborateur` (`id_collaborateur`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `post`
--
ALTER TABLE `post`
  ADD CONSTRAINT `fk_post_utilisateur` FOREIGN KEY (`id_utilisateur`) REFERENCES `utilisateur` (`id_utilisateur`);

--
-- Contraintes pour la table `reclamation`
--
ALTER TABLE `reclamation`
  ADD CONSTRAINT `reclamation_ibfk_1` FOREIGN KEY (`id_employe`) REFERENCES `employe` (`id_employe`);

--
-- Contraintes pour la table `reponse`
--
ALTER TABLE `reponse`
  ADD CONSTRAINT `fk_reponse_commentaires` FOREIGN KEY (`id_cmntr`) REFERENCES `commentaires` (`id_cmntr`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_reponse_utilisateur` FOREIGN KEY (`id_utilisateur`) REFERENCES `utilisateur` (`id_utilisateur`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `reservation`
--
ALTER TABLE `reservation`
  ADD CONSTRAINT `fk_reservation_employe` FOREIGN KEY (`id_employe`) REFERENCES `employe` (`id_employe`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `reservation_ibfk_1` FOREIGN KEY (`id_offre`) REFERENCES `offre` (`id_offre`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `signaler`
--
ALTER TABLE `signaler`
  ADD CONSTRAINT `fk_signaler_post` FOREIGN KEY (`id_post`) REFERENCES `post` (`id_post`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_signaler_utilisateur` FOREIGN KEY (`id_utilisateur`) REFERENCES `utilisateur` (`id_utilisateur`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `typechambre`
--
ALTER TABLE `typechambre`
  ADD CONSTRAINT `typechambre_ibfk_1` FOREIGN KEY (`id_grandhotel`) REFERENCES `grandhotel` (`id_grandHotel`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `voyage`
--
ALTER TABLE `voyage`
  ADD CONSTRAINT `fk_voyage_offre` FOREIGN KEY (`id_offre`) REFERENCES `offre` (`id_offre`) ON DELETE CASCADE;

DELIMITER $$
--
-- Évènements
--
CREATE DEFINER=`root`@`localhost` EVENT `update_reservation_status` ON SCHEDULE EVERY 1 HOUR STARTS '2024-06-04 19:45:23' ON COMPLETION NOT PRESERVE ENABLE DO UPDATE reservation
  SET etat = 'annuler'
  WHERE etat = 'en_cours' AND date_reservation < NOW() - INTERVAL 24 HOUR$$

CREATE DEFINER=`root`@`localhost` EVENT `update_offre_remise` ON SCHEDULE EVERY 1 MINUTE STARTS '2024-06-04 19:45:23' ON COMPLETION NOT PRESERVE ENABLE DO BEGIN
    UPDATE offre
    SET remise = 0
    WHERE date_fin <= NOW() AND remise <> 0;
  END$$

CREATE DEFINER=`root`@`localhost` EVENT `reset_SemaineLike` ON SCHEDULE EVERY 1 WEEK STARTS '2024-06-04 00:00:00' ON COMPLETION NOT PRESERVE ENABLE DO BEGIN
    UPDATE post
    SET SemaineLike = 0;
  END$$

CREATE DEFINER=`root`@`localhost` EVENT `reset_semaineCom` ON SCHEDULE EVERY 1 WEEK STARTS '2024-06-04 00:00:00' ON COMPLETION NOT PRESERVE ENABLE DO BEGIN
    UPDATE commentaires
    SET semaineCom = 0;
  END$$

CREATE DEFINER=`root`@`localhost` EVENT `delete_discussion` ON SCHEDULE EVERY 1 MINUTE STARTS '2024-06-04 19:45:23' ON COMPLETION NOT PRESERVE ENABLE DO BEGIN
    DELETE FROM discussion
    WHERE date_fin < NOW();
  END$$

DELIMITER ;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
