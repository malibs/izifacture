-- Généré par scripts/generate-seed.mjs — ne pas éditer à la main.
-- Données de démonstration : une organisation, ses clients et ses factures.

begin;

delete from organizations where id = '00000000-0000-4000-8000-000000000001';

insert into organizations (id, name, legal_name, address, city, country, email, phone, ninea, rccm, currency, default_vat_rate, invoice_prefix, next_invoice_number)
values ('00000000-0000-4000-8000-000000000001', 'Baraka Studio', 'Baraka Studio SARL', '23 avenue Cheikh Anta Diop, Point E', 'Dakar', 'Sénégal', 'contact@barakastudio.sn', '+221 33 825 40 12', '0057412398', 'SN-DKR-2019-B-1204', 'XOF', 18, 'FACT', 3046);

insert into clients (id, organization_id, name, company_name, email, phone, address, city, country) values
  ('11111111-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', 'Aïssatou Diallo', 'Sahel Digital', 'aissatou@saheldigital.sn', '+221 77 452 18 04', '12 rue Carnot, Plateau', 'Dakar', 'Sénégal'),
  ('11111111-0000-4000-8000-000000000002', '00000000-0000-4000-8000-000000000001', 'Kwame Mensah', 'Baobab Logistics', 'k.mensah@baobablog.ci', '+225 07 88 31 20', 'Boulevard Latrille, Cocody', 'Abidjan', 'Côte d''Ivoire'),
  ('11111111-0000-4000-8000-000000000003', '00000000-0000-4000-8000-000000000001', 'Fatou Bâ', 'Teranga Immobilier', 'fatou.ba@teranga-immo.sn', '+221 76 210 77 39', 'Almadies, Route de Ngor', 'Dakar', 'Sénégal'),
  ('11111111-0000-4000-8000-000000000004', '00000000-0000-4000-8000-000000000001', 'Ibrahim Traoré', 'Faso Agro', 'ibrahim@fasoagro.bf', '+226 70 14 55 82', 'Secteur 15, Avenue Kwame Nkrumah', 'Ouagadougou', 'Burkina Faso'),
  ('11111111-0000-4000-8000-000000000005', '00000000-0000-4000-8000-000000000001', 'Chidinma Okafor', 'Lagos Fintech Hub', 'chidinma@lagosfintech.ng', '+234 803 221 4478', 'Victoria Island, Adeola Odeku', 'Lagos', 'Nigeria'),
  ('11111111-0000-4000-8000-000000000006', '00000000-0000-4000-8000-000000000001', 'Moussa Kéita', 'Niger Solar', 'm.keita@nigersolar.ne', '+227 90 66 12 43', 'Quartier Plateau, Rue du Damergou', 'Niamey', 'Niger'),
  ('11111111-0000-4000-8000-000000000007', '00000000-0000-4000-8000-000000000001', 'Nadia Benkirane', 'Atlas Consulting', 'n.benkirane@atlas-consulting.ma', '+212 661 90 44 27', 'Rue Ibn Batouta, Maârif', 'Casablanca', 'Maroc'),
  ('11111111-0000-4000-8000-000000000008', '00000000-0000-4000-8000-000000000001', 'Serge Ondo', 'Cameroon Media Group', 'serge.ondo@cmg.cm', '+237 6 99 12 07 65', 'Bonanjo, Boulevard de la Liberté', 'Douala', 'Cameroun');

insert into invoices (id, organization_id, client_id, number, status, issue_date, due_date, vat_rate, subtotal, vat_amount, total, amount_paid, project_name) values
  ('22222222-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '11111111-0000-4000-8000-000000000001', 'FACT-3045', 'draft', '2026-08-14', '2026-09-13', 18, 4250000, 765000, 5015000, 0, 'Refonte plateforme e-commerce'),
  ('22222222-0000-4000-8000-000000000002', '00000000-0000-4000-8000-000000000001', '11111111-0000-4000-8000-000000000002', 'FACT-3044', 'draft', '2026-08-10', '2026-09-09', 18, 5950000, 1071000, 7021000, 0, 'Application mobile de suivi de flotte'),
  ('22222222-0000-4000-8000-000000000003', '00000000-0000-4000-8000-000000000001', '11111111-0000-4000-8000-000000000003', 'FACT-3043', 'draft', '2026-07-22', '2026-08-21', 18, 2850000, 513000, 3363000, 3363000, 'Portail de gestion locative'),
  ('22222222-0000-4000-8000-000000000004', '00000000-0000-4000-8000-000000000001', '11111111-0000-4000-8000-000000000004', 'FACT-3042', 'draft', '2026-06-28', '2026-07-28', 18, 3100000, 558000, 3658000, 0, 'Design system agricole'),
  ('22222222-0000-4000-8000-000000000005', '00000000-0000-4000-8000-000000000001', '11111111-0000-4000-8000-000000000005', 'FACT-3041', 'draft', '2026-08-06', '2026-09-05', 18, 4750000, 747000, 5497000, 0, 'Tableau de bord analytique'),
  ('22222222-0000-4000-8000-000000000006', '00000000-0000-4000-8000-000000000001', '11111111-0000-4000-8000-000000000006', 'FACT-3040', 'draft', '2026-08-25', '2026-09-24', 18, 1250000, 225000, 1475000, 0, 'Site vitrine et catalogue solaire'),
  ('22222222-0000-4000-8000-000000000007', '00000000-0000-4000-8000-000000000001', '11111111-0000-4000-8000-000000000007', 'FACT-3039', 'draft', '2026-07-05', '2026-08-04', 18, 1700000, 306000, 2006000, 2006000, 'Audit de sécurité applicative'),
  ('22222222-0000-4000-8000-000000000008', '00000000-0000-4000-8000-000000000001', '11111111-0000-4000-8000-000000000008', 'FACT-3038', 'draft', '2026-07-02', '2026-08-01', 18, 6400000, 1152000, 7552000, 0, 'Plateforme de diffusion vidéo'),
  ('22222222-0000-4000-8000-000000000009', '00000000-0000-4000-8000-000000000001', '11111111-0000-4000-8000-000000000001', 'FACT-3037', 'draft', '2026-06-30', '2026-07-30', 18, 900000, 162000, 1062000, 1062000, 'Maintenance trimestrielle'),
  ('22222222-0000-4000-8000-000000000010', '00000000-0000-4000-8000-000000000001', '11111111-0000-4000-8000-000000000003', 'FACT-3036', 'draft', '2026-08-26', '2026-09-25', 18, 900000, 162000, 1062000, 0, 'Campagne d''acquisition digitale'),
  ('22222222-0000-4000-8000-000000000011', '00000000-0000-4000-8000-000000000001', '11111111-0000-4000-8000-000000000002', 'FACT-3035', 'draft', '2026-06-12', '2026-07-12', 18, 4000000, 720000, 4720000, 4720000, 'Intégration ERP transport'),
  ('22222222-0000-4000-8000-000000000012', '00000000-0000-4000-8000-000000000001', '11111111-0000-4000-8000-000000000005', 'FACT-3034', 'draft', '2026-06-18', '2026-07-18', 18, 2250000, 405000, 2655000, 0, 'Refonte identité de marque'),
  ('22222222-0000-4000-8000-000000000013', '00000000-0000-4000-8000-000000000001', '11111111-0000-4000-8000-000000000006', 'FACT-3033', 'draft', '2026-05-28', '2026-06-27', 18, 1600000, 288000, 1888000, 1888000, 'Étude de faisabilité mini-réseaux'),
  ('22222222-0000-4000-8000-000000000014', '00000000-0000-4000-8000-000000000001', '11111111-0000-4000-8000-000000000007', 'FACT-3032', 'draft', '2026-08-20', '2026-09-19', 18, 2100000, 378000, 2478000, 0, 'Accompagnement conformité RGPD');

insert into invoice_items (invoice_id, position, description, quantity, unit_price, vat_applicable, line_total) values
  ('22222222-0000-4000-8000-000000000001', 0, 'Conception UI/UX', 1, 1850000, true, 1850000),
  ('22222222-0000-4000-8000-000000000001', 1, 'Intégration front-end', 1, 2400000, true, 2400000),
  ('22222222-0000-4000-8000-000000000002', 0, 'Développement iOS et Android', 1, 5200000, true, 5200000),
  ('22222222-0000-4000-8000-000000000002', 1, 'Formation des équipes', 3, 250000, true, 750000),
  ('22222222-0000-4000-8000-000000000003', 0, 'Développement du portail', 1, 2650000, true, 2650000),
  ('22222222-0000-4000-8000-000000000003', 1, 'Hébergement annuel', 1, 200000, true, 200000),
  ('22222222-0000-4000-8000-000000000004', 0, 'Design system complet', 1, 3100000, true, 3100000),
  ('22222222-0000-4000-8000-000000000005', 0, 'Entrepôt de données', 1, 4150000, true, 4150000),
  ('22222222-0000-4000-8000-000000000005', 1, 'Licences tierces (exonérées)', 1, 600000, false, 600000),
  ('22222222-0000-4000-8000-000000000006', 0, 'Site vitrine 8 pages', 1, 1250000, true, 1250000),
  ('22222222-0000-4000-8000-000000000007', 0, 'Audit et rapport', 1, 1700000, true, 1700000),
  ('22222222-0000-4000-8000-000000000008', 0, 'Infrastructure de streaming', 1, 6400000, true, 6400000),
  ('22222222-0000-4000-8000-000000000009', 0, 'Maintenance mensuelle', 3, 300000, true, 900000),
  ('22222222-0000-4000-8000-000000000010', 0, 'Stratégie et création', 1, 900000, true, 900000),
  ('22222222-0000-4000-8000-000000000011', 0, 'Connecteurs ERP', 1, 4000000, true, 4000000),
  ('22222222-0000-4000-8000-000000000012', 0, 'Identité visuelle complète', 1, 2250000, true, 2250000),
  ('22222222-0000-4000-8000-000000000013', 0, 'Étude terrain et rapport', 1, 1600000, true, 1600000),
  ('22222222-0000-4000-8000-000000000014', 0, 'Accompagnement 6 mois', 6, 350000, true, 2100000);

update invoices set status = 'sent', sent_at = '2026-08-14T08:00:00Z' where id = '22222222-0000-4000-8000-000000000001';
update invoices set status = 'sent', sent_at = '2026-08-10T08:00:00Z' where id = '22222222-0000-4000-8000-000000000002';
update invoices set status = 'paid', sent_at = '2026-07-22T08:00:00Z', paid_at = '2026-08-21T08:00:00Z' where id = '22222222-0000-4000-8000-000000000003';
update invoices set status = 'sent', sent_at = '2026-06-28T08:00:00Z' where id = '22222222-0000-4000-8000-000000000004';
update invoices set status = 'sent', sent_at = '2026-08-06T08:00:00Z' where id = '22222222-0000-4000-8000-000000000005';
update invoices set status = 'paid', sent_at = '2026-07-05T08:00:00Z', paid_at = '2026-08-04T08:00:00Z' where id = '22222222-0000-4000-8000-000000000007';
update invoices set status = 'sent', sent_at = '2026-07-02T08:00:00Z' where id = '22222222-0000-4000-8000-000000000008';
update invoices set status = 'paid', sent_at = '2026-06-30T08:00:00Z', paid_at = '2026-07-30T08:00:00Z' where id = '22222222-0000-4000-8000-000000000009';
update invoices set status = 'paid', sent_at = '2026-06-12T08:00:00Z', paid_at = '2026-07-12T08:00:00Z' where id = '22222222-0000-4000-8000-000000000011';
update invoices set status = 'sent', sent_at = '2026-06-18T08:00:00Z' where id = '22222222-0000-4000-8000-000000000012';
update invoices set status = 'paid', sent_at = '2026-05-28T08:00:00Z', paid_at = '2026-06-27T08:00:00Z' where id = '22222222-0000-4000-8000-000000000013';
update invoices set status = 'sent', sent_at = '2026-08-20T08:00:00Z' where id = '22222222-0000-4000-8000-000000000014';

commit;
