-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : mar. 30 avr. 2024 à 21:07
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
-- Structure de la table `cadeaux`
--

CREATE TABLE `cadeaux` (
  `id_cadeau` int(11) NOT NULL,
  `nom_cadeau` varchar(200) NOT NULL
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
(6, 47, 0, '2024-04-22 14:47:52'),
(8, 50, 10, '2024-04-03 18:42:21'),
(9, 51, 0, NULL),
(10, 52, 10, '2024-04-27 23:49:23');

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
  `archiver` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `collaborateur`
--

INSERT INTO `collaborateur` (`id_collaborateur`, `nom`, `type`, `adresse`, `tel`, `email`, `siteWeb`, `logo`, `archiver`) VALUES
(2, 'Travel Todo', 'Agence de voyage', 'Charguia II - 2035 TUNIS ', '70103103', 'respcarthage@traveltodo.com', 'www.traveltodo.com', 'uploads/1711766115706.png', 0),
(6, 'Tunisie Booking', 'Agence de voyages', 'Houmet Souk Djerba', '71124124', 'contact@tunisiebooking.com', 'tn.tunisiebooking.com', 'uploads/1711987428873.png', 0),
(18, 'safari voyages', 'Agence de voyage', ' Lafayette - Tunis', '71860050', 'galaxy@safarivoyages.tn', 'www.safarivoyages.tn', 'uploads/1711984819395.png', 0),
(27, 'Solaris Bateau du Lac', 'Service de location de bateaux à Tunis', 'Cheikh Zayed, Tunis 1053', '71960983', 'commercial@slal.com.tn', '', 'uploads/1713735207901.jpg', 0);

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
  `nbr_likeCom` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `commentaires`
--

INSERT INTO `commentaires` (`id_cmntr`, `cmntr`, `id_post`, `date_cmntr`, `id_utilisateur`, `nbr_likeCom`) VALUES
(9, 'bb', 13, '2024-03-11 10:01:08', 34, 0),
(61, 'aaa', 43, '2024-03-14 14:31:37', 27, 2),
(69, '66', 12, '2024-03-15 18:08:26', 3, 0),
(101, 'aa', 43, '2024-03-17 15:56:37', 27, 0),
(102, 'aa', 13, '2024-03-19 16:36:10', 27, 0),
(103, 'aa', 13, '2024-03-20 17:40:08', 27, 0),
(104, 'aa', 13, '2024-03-20 17:40:09', 27, 0),
(105, 'aa', 13, '2024-03-20 17:40:10', 27, 0),
(106, 'aa', 43, '2024-03-21 04:11:40', 27, 0),
(107, 'aa', 43, '2024-03-21 04:11:42', 27, 0),
(108, 'nice', 43, '2024-03-25 07:53:38', 3, 0),
(111, 'saha toutou', 151, '2024-04-23 23:27:55', 3, 0),
(112, 'aaaaaaaaaa', 43, '2024-04-25 13:03:35', 3, 0),
(114, 'azezae', 169, '2024-04-30 15:06:44', 27, 0);

-- --------------------------------------------------------

--
-- Structure de la table `demande`
--

CREATE TABLE `demande` (
  `id_demande` int(11) NOT NULL,
  `id_employe` int(11) NOT NULL,
  `titre` varchar(200) NOT NULL,
  `description` varchar(200) NOT NULL,
  `date_demande` datetime NOT NULL,
  `signature` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `demande`
--

INSERT INTO `demande` (`id_demande`, `id_employe`, `titre`, `description`, `date_demande`, `signature`) VALUES
(15, 1, 'devenir un adherant', 'zaezae', '2024-04-24 23:02:05', 'data:image/png;base64,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');

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
(1, 27, 0),
(2, 49, 0),
(3, 34, 0);

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
(24, 43, 47),
(25, 80, 47),
(27, 142, 34),
(30, 43, 27),
(31, 12, 27),
(32, 151, 27),
(33, 166, 3);

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

--
-- Déchargement des données de la table `evaluation`
--

INSERT INTO `evaluation` (`id_evaluation`, `id_offre`, `id_employe`, `vote`) VALUES
(1, 13, 2, 5),
(2, 13, 1, 5),
(5, 12, 1, 3);

-- --------------------------------------------------------

--
-- Structure de la table `gagnant`
--

CREATE TABLE `gagnant` (
  `id_gagnant` int(11) NOT NULL,
  `date_gagnant` int(11) NOT NULL,
  `id_client` int(11) NOT NULL,
  `id_cadeau` int(11) NOT NULL
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
  `aire_de_jeux_enfants` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `grandhotel`
--

INSERT INTO `grandhotel` (`id_grandHotel`, `id_offre`, `nom_hotel`, `etoiles`, `climatisation`, `wifi`, `piscine_exterieure`, `piscine_couverte`, `bassin_enfants`, `parking`, `discotheque`, `plage_privee`, `ascenseur`, `salle_de_sport`, `aire_de_jeux_enfants`) VALUES
(1, 23, 'kuriat', 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1);

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
(1, 'Tunis', 156),
(4, 'Turkie', 162),
(5, 'France', 163),
(6, 'UK', 164),
(7, 'Ayoub', 165),
(8, 'Rania', 166),
(9, 'Tunis', 167),
(10, 'Tunis', 168),
(11, 'tunis', 169);

-- --------------------------------------------------------

--
-- Structure de la table `hotel`
--

CREATE TABLE `hotel` (
  `id_hotel` int(11) NOT NULL,
  `nbr_adults` int(11) NOT NULL,
  `nbr_enfants` int(11) NOT NULL,
  `prix` float NOT NULL,
  `id_reservation` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `hotel`
--

INSERT INTO `hotel` (`id_hotel`, `nbr_adults`, `nbr_enfants`, `prix`, `id_reservation`) VALUES
(29, 2, 1, 6656, 45),
(30, 1, 2, 5824, 45),
(31, 1, 0, 1542.1, 47);

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
(42, 'uploads\\photos-1711447339035.jpg', 80),
(43, 'uploads\\photos-1711447339051.jpg', 80),
(46, 'uploads\\photos-1712499374978.jpg', 151),
(47, 'uploads\\photos-1712499374980.jpg', 151),
(48, 'uploads\\photos-1712499374983.jpg', 151),
(51, 'uploads\\photos-1714489600176.jpg', 169),
(52, 'uploads\\photos-1714489600182.jpg', 169);

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
(13, 12, 'uploads\\photos-1712011137922.jpg'),
(14, 13, 'uploads\\photos-1712011207230.jpg'),
(57, 11, 'uploads\\527b2bde7ae2434cc4f3747f410fbb05'),
(58, 11, 'uploads\\a0d6f81f391e255fb9bbe71d9452517b'),
(59, 11, 'uploads\\bda691c12f9a539da40086124c6786c5'),
(63, 21, 'uploads\\0c94739313cac5a934bc6d508721bb79'),
(64, 21, 'uploads\\cfbfca5b1a9c657f255c1e9ab2ee2d13'),
(65, 22, 'uploads\\369e8f5fc24f6f1a3dfe5b9481aed304'),
(66, 22, 'uploads\\e019a65e62c66132884e9ea1259d453d'),
(67, 22, 'uploads\\3c9cd22e6def91c8c8081102f490bd72'),
(68, 22, 'uploads\\446c33ca1461ae3851644a3bcc4f6ca4'),
(69, 23, 'uploads\\eb9d66c75fe074159597a65f01ea099e'),
(70, 23, 'uploads\\86ea44414100afe2c02df56fd38a6f27'),
(71, 23, 'uploads\\69fef78ed6910558c247ca7da5c5f89e'),
(72, 23, 'uploads\\afdc08b54448f73de252bde5c97d81ae');

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
(65, 61, 47, '2024-03-26 10:02:50');

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
(111, 12, 27, '2024-03-18 21:14:09'),
(116, 13, 27, '2024-03-19 16:36:25'),
(123, 43, 27, '2024-03-24 23:28:27');

-- --------------------------------------------------------

--
-- Structure de la table `mention`
--

CREATE TABLE `mention` (
  `id_mention` int(11) NOT NULL,
  `id_post` int(11) NOT NULL,
  `id_offre` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `mention`
--

INSERT INTO `mention` (`id_mention`, `id_post`, `id_offre`) VALUES
(48, 151, 13);

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
(269, 143, '10 points sont ajoutés à votre boutique', 0, 1, 50, 50, '2024-04-03 18:42:21', 0, 0, 50, '', 0, 0),
(273, 151, 'a commenté votre publication', 0, 0, 49, 3, '2024-04-23 23:27:55', 111, 0, 49, 'comment', 0, 0),
(275, 43, 'a commenté votre publication', 0, 1, 27, 3, '2024-04-25 13:03:35', 112, 0, 27, 'comment', 0, 0),
(277, 155, '10 points sont ajoutés à votre boutique', 0, 0, 52, 52, '2024-04-27 23:49:23', 0, 0, 52, '', 0, 0),
(278, 151, 'a répondu à votre commentaire', 127, 1, 49, 27, '2024-04-30 00:37:25', 111, 0, 3, 'comment', 0, 0),
(279, 151, 'a répondu à un commentaire dans votre post', 127, 0, 49, 27, '2024-04-30 00:37:25', 111, 0, 49, 'comment', 0, 0);

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
  `destination` varchar(400) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `offre`
--

INSERT INTO `offre` (`id_offre`, `titre`, `description`, `date_debut`, `date_fin`, `prix`, `id_collaborateur`, `remise`, `type`, `destination`) VALUES
(11, 'Voayge organisé a DUBAI', 'decouvrir avec nous dubai', '2024-04-01', '2024-04-17', 5200, 6, 20, 'hotel', ''),
(12, 'Voyage a Bali', 'Bali située en Indonésie , une ile trop belle ', '2024-04-02', '2024-04-24', 9400, 2, 20, 'autre', ''),
(13, 'Turquie !!', 'Le pays des histoires de HARIM EL SOLTAN', '2024-04-09', '2024-04-24', 2203, 18, 30, 'autre', ''),
(21, 'London', '\r\nDécouvrez la magie de Londres avec notre voyage exceptionnel ', '2024-04-27', '2024-05-05', 5766, 6, 0, 'autre', ''),
(22, 'jaz tour khalef', 'hotel 5* de luxe', '2024-04-21', '2024-04-25', 320, 2, 0, 'hotel', ''),
(23, 'Hotel Kuriat palace', 'Hotel 5* située a Monastir', '2024-04-22', '2024-04-24', 440, 18, 0, 'hotel', '');

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
  `type` enum('hotel','voyage','activite','autre') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `post`
--

INSERT INTO `post` (`id_post`, `contenu`, `date_post`, `id_utilisateur`, `nbr_likes`, `type`) VALUES
(12, 'barcha jaw 22', '2024-03-07 18:46:45', 27, 1, 'voyage'),
(13, 'aa', '2024-03-07 22:43:18', 3, 1, ''),
(43, 'slm', '2024-03-12 16:53:15', 27, 2, ''),
(80, 'voyage', '2024-03-26 10:02:19', 47, 0, ''),
(142, 'cc', '2024-04-03 18:39:47', 34, 0, ''),
(143, 'cc', '2024-04-03 18:42:21', 50, 0, ''),
(151, 'Mon voyage en Turquie restera à jamais gravé dans ma mémoire comme l\'une des expériences les plus enrichissantes de ma vie. Grâce à une offre incroyable que j\'ai découverte, j\'ai eu l\'opportunité de p', '2024-04-07 14:16:14', 49, 0, ''),
(152, 'aaa', '2024-04-22 14:47:52', 47, 0, 'voyage'),
(155, 'zazaezae', '2024-04-27 23:49:23', 52, 0, 'hotel'),
(156, '#Tunis behya ', '2024-04-30 12:18:39', 3, 0, 'voyage'),
(162, '#Turkie behya', '2024-04-30 12:30:12', 3, 0, 'autre'),
(163, '#France 5ayba', '2024-04-30 12:35:48', 3, 0, 'hotel'),
(164, '#UK behya', '2024-04-30 12:35:56', 3, 0, 'hotel'),
(165, '#Ayoub behy', '2024-04-30 12:36:36', 3, 0, 'autre'),
(166, '#Rania behya', '2024-04-30 12:36:43', 3, 0, 'autre'),
(167, '#Tunis aa', '2024-04-30 13:22:05', 27, 0, 'hotel'),
(168, '#Tunis aa', '2024-04-30 14:16:36', 27, 0, 'voyage'),
(169, '#tunis azezae', '2024-04-30 15:06:40', 27, 0, 'voyage');

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
(97, 'abcdefghi', 101, 27, 0),
(109, 'aaa', 9, 27, 0),
(127, 'undefinedundefined', 111, 27, 0);

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
  `typeR` enum('hotel','autre') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `reservation`
--

INSERT INTO `reservation` (`id_reservation`, `date_reservation`, `id_offre`, `id_employe`, `etat`, `nombre`, `prix_totale`, `typeR`) VALUES
(45, '2024-04-19 16:47:35', 11, 1, 'annuler', 2, 12480, 'hotel'),
(46, '2024-04-19 16:47:40', 12, 1, 'accepter', 3, 22560, 'autre'),
(47, '2024-04-19 17:57:17', 13, 1, 'accepter', 1, 1542.1, 'hotel'),
(50, '2024-04-22 14:54:53', 12, 1, 'reparation', 1, 7520, 'autre'),
(51, '2024-04-25 15:06:33', 13, 1, 'refuser', 2, 4406, 'autre'),
(52, '2024-04-25 15:47:57', 13, 2, 'reparation', 1, 2203, 'autre'),
(53, '2024-04-25 15:59:34', 12, 1, 'confirmer', 1, 9400, 'autre'),
(54, '2024-04-25 15:59:35', 12, 1, 'en_cours', 1, 9400, 'autre');

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
  `isOpen` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `signaler`
--

INSERT INTO `signaler` (`id_signaler`, `id_post`, `id_utilisateur`, `id_cmntr`, `id_reponse`, `isRead`, `isOpen`) VALUES
(1, 151, 27, 0, 0, 1, 1),
(2, 151, 27, 0, 0, 1, 1),
(3, 13, 27, 9, 0, 1, 1),
(5, 151, 3, 0, 0, 0, 1),
(6, 43, 3, 61, 125, 0, 1);

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
  `description` varchar(200) DEFAULT '''Profil en cours de personnalisation!''',
  `loginAttempts` int(11) NOT NULL DEFAULT 0,
  `lockUntil` datetime NOT NULL,
  `nbr_notifs` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `utilisateur`
--

INSERT INTO `utilisateur` (`id_utilisateur`, `nom`, `prenom`, `email`, `motDePasse`, `photo`, `genre`, `type`, `etat`, `resetPasswordToken`, `resetPasswordExpires`, `description`, `loginAttempts`, `lockUntil`, `nbr_notifs`) VALUES
(3, 'admin', 'admin', 'admin@admin', '$2b$10$E6wr.2D7m7lRIW.XO/aBz.wJdXRS.g8WmW1aT2.a49lgFiDjWG6EW', 'uploads\\photo-1710752307440.jpg', 'homme', 'admin', 'autorise', '3280', '2024-04-01 17:03:10', 'Profil en cours de personnalisation!', 0, '0000-00-00 00:00:00', 0),
(27, 'Louati', 'Ayoub', 'ayoub.loueti1@gmail.com', '$2b$10$oQ5arfTsS.v7GlVYoHnOiutlTWjUcfjr/PBTdnAHjq23KFH1n3OMe', 'uploads\\photo-1711464305753.jpg', 'homme', 'employe', 'autorise', '7522', '2024-03-25 01:04:32', 'Profil en cours de personnalisation!', 0, '0000-00-00 00:00:00', 0),
(34, 'Benali', 'Rania', 'benalirania855@gmail.com', '', '', 'femme', 'employe', 'autorise', '', NULL, 'Hiii i\'m rania ', 0, '2024-03-05 00:00:00', 0),
(35, '', '', 'ahla@gmail', '$2b$10$wruDUeeAle2.Lgq9BYGrB.JnLeItCwMdOnReSo/uhKNe9OHDdAjjS', '', 'inconnu', 'employe', 'En attente', '8851', '2024-03-04 16:41:04', 'Profil en cours de personnalisation!', 0, '2024-03-05 00:00:00', 0),
(36, 'hi', 'hellooooo', 'Hello@hello', '$2b$10$NhMjT7X93NYLwWOEThZgeel1NIYacE0r46dD.nyZ/L54Abc2Fqqge', '', 'femme', 'client', 'En attente', '9255', '2024-03-04 21:55:40', 'Profil en cours de personnalisation!', 0, '2024-03-05 00:00:00', 0),
(37, '', '', 'mariem@mariem', '$2b$10$EvlsxBesC/3EHS6Vc9bwCO.7APN/T9XCP8L/Q0CYPnFTUQ6dPES9G', '', 'inconnu', 'client', 'En attente', '6288', '2024-03-04 20:17:43', 'Profil en cours de personnalisation!', 0, '2024-03-05 00:00:00', 0),
(47, 'ayoub', 'loueti', 'ayoub.nightraid123@gmail.com', '$2b$10$ULzjhxBQMBsRGRaBoFSVFuHaDveIkN2t8zN.htdBryTYjpY5uo2oO', 'uploads\\photo-1711447296780.jpg', 'homme', 'client', 'autorise', '1821', '2024-03-26 11:00:28', 'Profil en cours de personnalisation!', 0, '0000-00-00 00:00:00', 0),
(49, 'nasr', 'taher', 'nasrmohammedtaher01@gmail.com', '$2b$10$Q8Xb.0PdXeR4gwRYq.1vOOSGRT5qxST2YKaRbqu1gk6b3lZTUXA3a', 'uploads\\photo-1711670324364.png', 'homme', 'employe', 'autorise', '4852', '2024-03-29 00:55:30', 'Profil en cours de personnalisation!', 0, '0000-00-00 00:00:00', 2),
(50, 'Khemiri', 'hakim', 'hakimkhemeri326@gmail.com', '$2b$10$5vcceITHnUtcPD5Ythf56udoHh3fXXJa.J94wt614PoVpHHSy78Ha', 'uploads\\photo-1711671010745.png', 'homme', 'client', 'autorise', '6872', '2024-03-29 01:00:28', 'Profil en cours de personnalisation!', 0, '0000-00-00 00:00:00', 0),
(51, '', '', 'Amirlouati8@gmail.com', '$2b$10$WGQTFeAt.CHzddvynCKk6.E1cAYJyEJfF/xj5sXhxw2yfsMOmu6Rm', '', 'inconnu', 'client', 'En attente', '8800', '2024-04-22 15:35:30', 'Profil en cours de personnalisation!', 0, '0000-00-00 00:00:00', 0),
(52, 'Eya', 'Akkari', 'akkeriaya345@gmail.com', '$2b$10$O0GNuaP/lpJ1hi9i9x1tfe/Gj3gryBL48lTjFrhhAbMwKARaUQseK', '', 'femme', 'client', 'autorise', '3608', '2024-04-28 00:48:00', 'Profil en cours de personnalisation!', 0, '0000-00-00 00:00:00', 0);

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
-- Index pour la table `cadeaux`
--
ALTER TABLE `cadeaux`
  ADD PRIMARY KEY (`id_cadeau`);

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
-- Index pour la table `gagnant`
--
ALTER TABLE `gagnant`
  ADD PRIMARY KEY (`id_gagnant`),
  ADD KEY `fk_gagn_client` (`id_client`),
  ADD KEY `fk_gagn_cadeau` (`id_cadeau`);

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
-- Index pour la table `mention`
--
ALTER TABLE `mention`
  ADD PRIMARY KEY (`id_mention`),
  ADD KEY `fk_mention_post` (`id_post`),
  ADD KEY `fk_mention_offre` (`id_offre`);

--
-- Index pour la table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id_notif`),
  ADD KEY `id_post` (`id_post`),
  ADD KEY `id_utilisateur` (`id_utilisateur`),
  ADD KEY `id_own_post` (`id_own_post`);

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
  MODIFY `id_activite` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `admin`
--
ALTER TABLE `admin`
  MODIFY `id_admin` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `cadeaux`
--
ALTER TABLE `cadeaux`
  MODIFY `id_cadeau` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `client`
--
ALTER TABLE `client`
  MODIFY `id_client` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT pour la table `collaborateur`
--
ALTER TABLE `collaborateur`
  MODIFY `id_collaborateur` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT pour la table `commentaires`
--
ALTER TABLE `commentaires`
  MODIFY `id_cmntr` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=115;

--
-- AUTO_INCREMENT pour la table `demande`
--
ALTER TABLE `demande`
  MODIFY `id_demande` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT pour la table `employe`
--
ALTER TABLE `employe`
  MODIFY `id_employe` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT pour la table `enregistrement`
--
ALTER TABLE `enregistrement`
  MODIFY `id_save` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT pour la table `evaluation`
--
ALTER TABLE `evaluation`
  MODIFY `id_evaluation` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT pour la table `gagnant`
--
ALTER TABLE `gagnant`
  MODIFY `id_gagnant` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `grandhotel`
--
ALTER TABLE `grandhotel`
  MODIFY `id_grandHotel` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `hachtag`
--
ALTER TABLE `hachtag`
  MODIFY `id_hachtag` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT pour la table `hotel`
--
ALTER TABLE `hotel`
  MODIFY `id_hotel` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT pour la table `image`
--
ALTER TABLE `image`
  MODIFY `id_image` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=53;

--
-- AUTO_INCREMENT pour la table `imageoffre`
--
ALTER TABLE `imageoffre`
  MODIFY `id_imageOffre` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=80;

--
-- AUTO_INCREMENT pour la table `likecom`
--
ALTER TABLE `likecom`
  MODIFY `id_likeCom` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=68;

--
-- AUTO_INCREMENT pour la table `likerep`
--
ALTER TABLE `likerep`
  MODIFY `id_likeRep` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT pour la table `likes`
--
ALTER TABLE `likes`
  MODIFY `id_like` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=130;

--
-- AUTO_INCREMENT pour la table `mention`
--
ALTER TABLE `mention`
  MODIFY `id_mention` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=49;

--
-- AUTO_INCREMENT pour la table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id_notif` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=280;

--
-- AUTO_INCREMENT pour la table `offre`
--
ALTER TABLE `offre`
  MODIFY `id_offre` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT pour la table `post`
--
ALTER TABLE `post`
  MODIFY `id_post` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=170;

--
-- AUTO_INCREMENT pour la table `reponse`
--
ALTER TABLE `reponse`
  MODIFY `id_reponse` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=128;

--
-- AUTO_INCREMENT pour la table `reservation`
--
ALTER TABLE `reservation`
  MODIFY `id_reservation` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=55;

--
-- AUTO_INCREMENT pour la table `signaler`
--
ALTER TABLE `signaler`
  MODIFY `id_signaler` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT pour la table `utilisateur`
--
ALTER TABLE `utilisateur`
  MODIFY `id_utilisateur` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=53;

--
-- AUTO_INCREMENT pour la table `voyage`
--
ALTER TABLE `voyage`
  MODIFY `id_voyage` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

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
-- Contraintes pour la table `gagnant`
--
ALTER TABLE `gagnant`
  ADD CONSTRAINT `fk_gagn_cadeau` FOREIGN KEY (`id_cadeau`) REFERENCES `cadeaux` (`id_cadeau`),
  ADD CONSTRAINT `fk_gagn_client` FOREIGN KEY (`id_client`) REFERENCES `client` (`id_client`);

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
-- Contraintes pour la table `mention`
--
ALTER TABLE `mention`
  ADD CONSTRAINT `fk_mention_offre` FOREIGN KEY (`id_offre`) REFERENCES `offre` (`id_offre`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_mention_post` FOREIGN KEY (`id_post`) REFERENCES `post` (`id_post`) ON DELETE CASCADE;

--
-- Contraintes pour la table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`id_post`) REFERENCES `post` (`id_post`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `notifications_ibfk_2` FOREIGN KEY (`id_utilisateur`) REFERENCES `utilisateur` (`id_utilisateur`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `notifications_ibfk_3` FOREIGN KEY (`id_own_post`) REFERENCES `post` (`id_utilisateur`) ON DELETE CASCADE ON UPDATE CASCADE;

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
-- Contraintes pour la table `voyage`
--
ALTER TABLE `voyage`
  ADD CONSTRAINT `fk_voyage_offre` FOREIGN KEY (`id_offre`) REFERENCES `offre` (`id_offre`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
