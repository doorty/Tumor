if (typeof eveo === "undefined") { eveo = {}; }
eveo.subtumor = {};
eveo.subtumor = {
	_type: "",
	_biomarker:"",
	_hotspots:null,
	_dialog:null,

	/* show popup given params for this function */
	showDialogTab: function(tabNum, eleHotspot, strContent, objCitations, isVisible) {

		if (!isVisible) {
			eveo.library.addClassName(eveo.subtumor._dialog, "hidden");
		}
		else {

			if (strContent) {
				var eleContent = document.getElementById("dialog-content");
				eleContent.innerHTML = strContent;
			}
			
			if (objCitations) {
				var eleCitations = document.getElementById("dialog-citations");
				
				//eleCitations.innerHTML = strCitations;

				var list = document.createElement("ul");
				list.className = "citations";
				
				for (var i=1, max=3; i <= max; i++) {
					if (objCitations[i]) {
						var li = document.createElement("li");
						li.innerHTML = objCitations[i];		
						list.appendChild(li);
					}
				}
				
				eleCitations.appendChild(list);
			}
			
			if (tabNum === 1) {
				eveo.library.removeClassName("dialog-tab-1", "selected");
				eveo.library.addClassName("dialog-tab-2", "selected");
				eveo.library.addClassName("dialog-citations", "hidden");
				eveo.library.removeClassName("dialog-content", "hidden");
			} 
			else {
				eveo.library.removeClassName("dialog-tab-2", "selected");
				eveo.library.addClassName("dialog-tab-1", "selected");
				eveo.library.addClassName("dialog-content", "hidden");
				eveo.library.removeClassName("dialog-citations", "hidden");
			}
			
			if (eleHotspot) {
				if (typeof eleHotspot === "string") { eleHotspot = document.getElementById(eleHotspot); }			
				if (!eleHotspot) { alert("Error: hotspot not found."); return; }
				
				// Hide popup if the same hotspot is touched/clicked again 
				var currentHotspot = eveo.subtumor._dialog.getAttribute('data-hotspot');
				if (currentHotspot === eleHotspot.id) { 
					if (eveo.library.hasClassName(eveo.subtumor._dialog, "hidden"))
						eveo.library.removeClassName(eveo.subtumor._dialog, "hidden"); 
					else
						eveo.library.addClassName(eveo.subtumor._dialog, "hidden"); 
					return; 
				}
				
				/* figure out where to place dialog box */
				var left = 0,
						top = 0,
						hotspotLeft = parseInt(eleHotspot.style.left,10),
						hotspotTop = parseInt(eleHotspot.style.top,10),
						hotspotWidth = parseInt(eleHotspot.style.width,10),
						hotspotHeight = parseInt(eleHotspot.style.height,10),
						dialogWidth = 350,
						dialogHeight = 228;
						//dialogWidth = parseInt(eveo.subtumor._dialog.style.width,10),
						//dialogHeight = parseInt(eveo.subtumor._dialog.style.height,10);
						
				left = hotspotLeft; // left-aligned with hotspot
				var maxLeft = (1024 - dialogWidth - 10);  // allows right margin of 10px
				if (left > maxLeft) {
					left = maxLeft;
				}
				
				top = (hotspotTop + hotspotHeight - 28); // place just below hotspot
				var maxTop = (768 - dialogHeight - 10); // allows bottom margin of 10px
				if (top > maxTop) {
					top = (hotspotTop - dialogHeight); // place just above hotspot
				}

				// assign computed value
				eveo.subtumor._dialog.style.left = left + "px";
				eveo.subtumor._dialog.style.top = top + "px";
			
				eveo.subtumor._dialog.setAttribute('data-hotspot', eleHotspot.id);

			}
			
			eveo.library.removeClassName(eveo.subtumor._dialog, "hidden");
		}
	},
	
	/* when the hotspot is clicked, get the corresponding content and citation text */
	hotspotClicked: function(e) {
		
		var content = "",
				citations = {},
				hotspot = eveo.caris.getTargetFromEvent(e).id;

		switch(true) {
		case (eveo.subtumor._type === "breast_tumor"):
				switch(true) {
					case (hotspot === "lapatinib"):
						content = "Lapatinib is an inhibitor of the tyrosine kinase domains of both the EGFR and HER2 receptors. Lapatinib is used in combination with capecitabine after tumor progression with trastuzumab.";
						citations = { 1: "", 2: "", 3: "" };
						break;
					case (hotspot === "trastuzumab"):
						content = "Trastuzumab is a monoclonal antibody that binds selectively to the extracellular domain of HER2. Trastuzumab preferentially mediates death of HER2-overexpressing cells through antibody-dependent cellular cytotoxicity (ADCC).";
						citations = { 1: "", 2: "", 3: "" };
						break;
					case (hotspot === "fu"):
						content = "5-FU, or 5-fluorouracil, is an antimetabolite that has often been used for the treatment of breast cancer, either alone or in combination with other cytostatic agents. After being converted to its active metabolite, 5-FdUMP, 5-FU irreversibly blocks TS.";
						citations = { 1: "", 2: "", 3: "" };
						break;
					case (hotspot === "paclitaxel"):
						content = "Paclitaxel stabilizes microtubules by preventing depolymerization, thereby inhibiting the normal dynamic reorganization of microtubules during mitosis. Taxanes, such as paclitaxel, have become the standard of care for treatment of first-line metastatic breast cancer and are incorporated into both adjuvant and neoadjuvant anthracycline-containing regimens.";
						citations = { 1: "", 2: "", 3: "" };
						break;
					case (hotspot === "docetaxel"):
						content = "Docetaxel, along with paclitaxel, have become the standard of care for first-line treatment of metastatic breast cancer and are incorporated into both adjuvant and neoadjuvant anthracycline-containing regimens. Taxanes, such as docetaxel, are believed to exert their effects by stabilizing microtubules, which induces cell cycle arrest leading to tumor cell apoptosis.";
						citations = { 1: "", 2: "", 3: "" };
						break;
					case (hotspot === "nab-paclitaxel"):
						content = "Nab-paclitaxel is an albumin-bound form of paclitaxel. Tumor cells adapt to their increasing nutrient needs by becoming vascularized. Because albumin in the blood normally helps carry nutrients to cells, including vascularized tumor cells, nab-paclitaxel serves as an efficient mechanism for delivering paclitaxel to the tumor.";
						citations = { 1: "", 2: "", 3: "" };
						break;
					case (hotspot === "anthracyclines"):
						content = "Anthracyclines are a class of drugs that include doxorubicin and epirubicin. They intercalate into DNA strands to form complexes that inhibit both DNA and RNA synthesis. Anthracyclines are also believed to stabilize normally transient DNA-topoisomerase reaction intermediates, in which the enzyme is covalently linked to DNA, increasing the rate of DNA cleavage or decreasing strand religation.";
						citations = { 1: "", 2: "", 3: "" };
						break;
					case (hotspot === "her2"):
						content = "The HER2, or human epidermal receptor 2, gene encodes a member of the epidermal growth factor receptor family of receptor tyrosine kinases. HER2 has no ligand binding domain and therefore cannot bind growth factors. HER2 must dimerize with other HER family members unless HER2 is overexpressed.  Overexpression of HER2 is associated with an aggressive clinical phenotype.";
						citations = { 
							1: "Press, M. F., R. S. Finn, et al. (2008). \"HER-2 gene amplification, HER-2 and epidermal growth factor receptor mRNA and protein expression, and lapatinib efficacy in women with metastatic breast cancer.\" Clin Cancer Res 14(23): 7861-70.", 
							2: "Seidman, A. D., M. N. Fornier, et al. (2001). \"Weekly trastuzumab and paclitaxel therapy for metastatic breast cancer with analysis of efficacy by HER2 immunophenotype and gene amplification.\" J Clin Oncol 19(10): 2587-95. 2) ", 
							3: "Cheang, M. C., S. K. Chia, et al. (2009). \"Ki67 index, HER2 status, and prognosis of patients with luminal B breast cancer.\" J Natl Cancer Inst 101(10): 736-50." };
						break;
					case (hotspot === "pten"):
						content = "PTEN, or phosphatase and tensin homolog, inhibits the PI3K-AKT cell survival pathway. Loss of PTEN function is one of the most common occurrences in advanced human cancer. PTEN loss of function is associated with poorer response to therapies that inhibit HER2, such as trastuzumab ";
						citations = { 
							1: "Dave, B., J.C. Chang, et al. (2011).  \"Loss of phosphatase and tensin homolog or phosphoinositol-3 kinase activation and response to trastuzumab or lapatinib in human epidermal growth factor receptor 2-overexpressing locally advanced breast cancers.\" J Clin Oncol 29(2): 166-173.", 
							2: "Nagata, Y., K. H. Lan, et al. (2004). \"PTEN activation contributes to tumor inhibition by trastuzumab, and loss of PTEN predicts trastuzumab resistance in patients.\" Cancer Cell 6(2): 117-27", 
							3: "Fujita, T., H. Doihara, et al. (2006). \"PTEN activity could be a predictive marker of trastuzumab efficacy in the treatment of ErbB2-overexpressing breast cancer.\" Br J Cancer 94(2): 247-52." };
						break;
					case (hotspot === "ts"):
						content = "TS, or thymidylate synthase, is a key enzyme in the de novo synthesis of DNA by converting dUMP to dTMP. TS is also a target of FdUMP. In breast cancer, TS overexpression is associated with aggressive phenotype, including large tumor size, nodal metastasis, and high histologic grade, as well as lower responsiveness to 5-FU-based therapies.";
						citations = { 
							1: "Toi, M., T. Ikeda, et al. (2007). \"Predictive implications of nucleoside metabolizing enzymes in premenopausal women with node-positive primary breast cancer who were randomly assigned to receive tamoxifen alone or tamoxifen plus tegafur-uracil as adjuvant therapy.\" Int J Oncol 31(4): 899-906.", 
							2: "Lee, S. J., Y. L. Choi, et al.  2011 \"Thymidylate synthase and thymidine phosphorylase as predictive markers of capecitabine monotherapy in patients with anthracycline- and taxane-pretreated metastatic breast cancer.\" Cancer Chemother Pharmacol. 68(3):743-51.", 
							3: "Yu, Z., J. Sun, et al. (2005). \"Thymidylate synthase predicts for clinical outcome in invasive breast cancer.\" Histol Histopathol 20(3): 871-8." };
						break;
					case (hotspot === "tle3"):
						content = "TLE3 is a transcriptional repressor that appears to be periodically expressed during the M phase of the cell cycle. Overexpression of TLE3 is associated with improved disease-free survival in patients receiving taxane-containing regimens vs. those containing an anthracycline without a taxane for adjuvant chemotherapy.";
						citations = { 
							1: "Kulkarni, S., D. Hicks, et al. (2009).\"TLE3 as a candidate biomarker of response to taxane therapy.\" Breast Cancer Research 11(2):R17", 
							2: "Kulkarni, S., D. Hicks, et al. (2009).\"TLE3 as a candidate biomarker of response to taxane therapy.\" Breast Cancer Research 11(2):R17", 
							3: "" };
						break;
					case (hotspot === "tubb3"):
						content = "TUBB3, or tubulin beta-3, is a protein that is encoded by the TUBB3 gene. Tubulin is the major constituent of microtubules. TUBB3 belongs to the tubulin family and plays a critical role in proper axon guidance and maintenance of tubulin.";
						citations = { 1: "", 2: "", 3: "" };
						break;
					case (hotspot === "sparc"):
						content = "SPARC, or secreted protein, acidic, rich in cysteine, is secreted by many types of cells. In addition to its normal role, SPARC also acts as a highly charged receptor that attracts and binds albumin and albumin-bound nutrients, concentrating them within the interstitial space around tumor cells. Overexpression of SPARC is associated with benefit from treatment with nab-paclitaxel.";
						citations = { 1: "", 2: "", 3: "" };
						break;
					case (hotspot === "pgp"):
						content = "PGP, or p-glycoprotein, is encoded by the <i>multidrug resistance-1 (MDR-1)</i> gene. PGP acts as an energy-dependent pump, which actively effluxes certain classes of chemotherapeutic compounds from cells, leading to poorer response. Overexpression of PGP is associated with poor clinical responses to neoadjuvant chemotherapy for breast cancer.";
						citations = { 
							1: "Chintamani, J. P. Singh, et al. (2005). \"Role of p-glycoprotein expression in predicting response to neoadjuvant chemotherapy in breast cancer--a prospective clinical study.\" World J Surg Oncol 3: 61.", 
							2: "", 
							3: "" };
						break;
					case (hotspot === "top2a"):
						content = "The <i>TOP2A</i> gene encodes topoisomerase II-α, an enzyme that relaxes supercoils in DNA to permit transcription. Due to its essential role in DNA synthesis and repair and frequent overexpression in tumors, TOP2A is an ideal target for antineoplastic agents, including drugs such as anthracyclines.";
						citations = { 
							1: "Arriola, E., J. S. Reis-Filho, et al.  (2007).  \"Topoisomerase II alpha amplification may predict benefit from adjuvant anthracyclines in HER2 positive early breast cancer.\"  Br Cancer Res Treat 106: 181-189.", 
							2: "Durbecq, V., M. Paesmans, et al. (2004). \"Topoisomerase-II alpha expression as a predictive marker in a population of advanced breast cancer patients randomly treated either with single-agent doxorubicin or single-agent docetaxel.\" Mol Cancer Ther 3(10): 1207-14.", 
							3: "Brase, J.C., M. C. Gehrmann, et al.  (2010).  \"ERBB2 and TOP2A in Breast Cancer: A comprehensive analysis of gene amplification, RNA levels, and protein expression and their influence on prognosis and prediction.\"  Clin Cancer Res 16(8): 2391-2401." };
						break;
					default:
						content = "Error: could not find: " + hotspot;
						citations = { 1: "", 2: "", 3: "" };
						return;
				}
				break;
			case (eveo.subtumor._type === "lung_tumor"):
				switch(true) {
					case (hotspot === "erlotinib"):
						content = "Erlotinib inhibits the intracellular phosphorylation of the EGFR receptor. NSCLC patients having mutations in the  EGFR tyrosine kinase domain or overexpression of EGFR are more responsive to erlotinib  treatment. Mutations in KRAS and EGFR are mutually exclusive.";
						citations = { 1: "", 2: "", 3: "" };
						break;
					case (hotspot === "crizotinib"):
						content = "Crizotinib is an inhibitor of multiple receptor tyrosine kinases, one of which is ALK.";
						citations = { 1: "", 2: "", 3: "" };
						break;
					case (hotspot === "gemcitabine"):
						content = "Gemcitabine is converted in cells by nucleoside kinases to gemcitabine diphosphate (dFdCDP) and subsequently to gemcitabine triphosphate (dFdCTP). dFdCDP inhibits ribonucleotide reductase and dFdCTP competes with dCTP for incorporation into DNA, terminating DNA chain elongation.";
						citations = { 1: "", 2: "", 3: "" };
						break;
					case (hotspot === "pemetrexed"):
						content = "Pemetrexed is a folate analog metabolic inhibitor that disrupts folate-dependent metabolic processes essential for cell replication. Pemetrexed inhibits both TS and DHFR.";
						citations = { 1: "", 2: "", 3: "" };
						break;
					case (hotspot === "paclitaxel"):
						content = "Paclitaxel stabilizes microtubules by preventing depolymerization, thereby inhibiting the normal dynamic reorganization of microtubules during mitosis.";
						citations = { 1: "", 2: "", 3: "" };
						break;
					case (hotspot === "docetaxel"):
						content = "Taxanes, such as docetaxel, are believed to exert their effects by stabilizing microtubules, which induces cell cycle arrest leading to tumor cell apoptosis.";
						citations = { 1: "", 2: "", 3: "" };
						break;
					case (hotspot === "irinotecan"):
						content = "Irinotecan interacts specifically with TOPO1. The cytotoxicity of irinotecan is due to double-strand DNA damage produced during DNA synthesis when replication enzymes interact with the complex formed by TOPO1, DNA, and either irinotecan or it’s active metabolite.";
						citations = { 1: "", 2: "", 3: "" };
						break;
					case (hotspot === "platinum-based-chemo"):
						content = "Platinum-based chemotherapies include cisplatin, carboplatin, and others. The cytotoxic effects of these drugs are attributed to the formation of platinum-DNA adducts, which cause inter- and intra-strand cross-linking.";
						citations = { 1: "", 2: "", 3: "" };
						break;
					case (hotspot === "egfr"):
						content = "The epidermal growth factor receptor (EGFR) triggers both the RAS-RAF-MAPK and the PI3K-AKT pathways, leading to  increased cell proliferation and increased cell survival. EGFR is expressed on the cell surface of normal cells. Mutations and/or overexpression of EGFR are found in a subpopulation of NSCLC patients.";
						citations = { 1: "", 2: "", 3: "" };
						break;
					case (hotspot === "ras"):
						content = "Mutations in KRAS are found in a subpopulation of NSCLC patients. Oncogenic forms of KRAS due to mutations at activating hotspots make KRAS  constitutively active in the absence of extracellular signals, causing cellular proliferation and tumor resistance to EGFR inhibitors, such as erlotinib.";
						citations = { 1: "", 2: "", 3: "" };
						break;
					case (hotspot === "eml4-alk"):
						content = "EML4-ALK is a tyrosine kinase fusion protein generated as a result of a rearrangement in chromosome 2. The presence of EML4-ALK in NSCLC correlates strongly with a history of nonsmoking or light smoking.<br><br>Prevalence of ALK rearrangements is 3-4% in unselected populations;  patients with ALK rearrangement also tend to be younger.";
						citations = { 1: "", 2: "", 3: "" };
						break;
					case (hotspot === "pten"):
						content = "PTEN, or phosphatase and tensin homolog, inhibits the PI3K-AKT cell survival pathway. Loss of PTEN function is one of the most common occurrences in advanced human cancer. ";
						citations = { 1: "", 2: "", 3: "" };
						break;
					case (hotspot === "rrm1"):
						content = "The <i>RRM1</i> gene encodes the regulatory subunit of ribonucleotide reductase, which catalyzes the reduction of ribonucleoside diphosphates to the corresponding deoxyribonucleotides. RRM1 expression is inversely correlated with disease response to gemcitabine.";
						citations = { 1: "", 2: "", 3: "" };
						break;
					case (hotspot === "ts"):
						content = "TS, or thymidylate synthase, is overexpressed in squamous cell carcinoma and high-grade NSCLC. High TS levels have been associated with lack of response to fluoropyrimidines, whereas low or no TS expression has been associated with improved clinical response to fluoropyrimidines.";
						citations = { 1: "", 2: "", 3: "" };
						break;
					case (hotspot === "tubb3"):
						content = "TUBB3, or class III-beta tubulin, is a protein that in humans is encoded by the TUBB3 gene. Tubulin is the major constituent of microtubules. TUBB3 belongs to the tubulin family and plays a critical role in proper axon guidance and maintenance of tubulin. ";
						citations = { 1: "", 2: "", 3: "" };
						break;
					case (hotspot === "pgp"):
						content = "PGP, or p-glycoprotein, is encoded by the multidrug resistance-1 (MDR-1) gene. PGP acts as an energy-dependent pump, which actively effluxes certain classes of chemotherapeutic compounds from cells. ";
						citations = { 1: "", 2: "", 3: "" };
						break;
					case (hotspot === "ercc1"):
						content = "ERCC1, or excision repair cross-complementation group 1, is a component of the nucleotide excision repair pathway. Overexpression of ERCC1 is associated with resistance to platinum-based therapies.";
						citations = { 1: "", 2: "", 3: "" };
						break;
					case (hotspot === "top01"):
						content = "TOPO1, or topoisomerase I, is an enzyme that releases supercoil tension of DNA by  transiently creating single-strand breaks. Regulation of DNA supercoiling is essential for DNA transcription and replication, because the DNA helix must unwind to permit the proper functioning of the enzymes necessary for DNA replication.";
						citations = { 1: "", 2: "", 3: "" };
						break;
					default:
						content = "Error: could not find: " + hotspot;
						citations = { 1: "", 2: "", 3: "" };
						return;
				}
				break;
			case (eveo.subtumor._type === "colon_tumor"):
				switch(true) {
					case (hotspot === "cetuximab"):
						content = "Cetuximab is a monoclonal antibody that binds selectively to the extracellular domain of EGFR, blocking phosphorylation and activation of EGFR, resulting in inhibition of cell growth and increased apoptosis, as well as other effects. Cetuximab may also mediate cell death through antibody-dependent cellular cytotoxicity (ADCC).";
						citations = { 1: "", 2: "", 3: "" };
						break;
					case (hotspot === "panitumumab"):
						content = "Panitumumab is a monoclonal antibody that binds specifically to EGFR on both normal and tumor cells and competitively inhibits binding of ligands for EGFR.  Panitumumab binding to EGFR prevents ligand-induced receptor autophosphorylation and activation of receptor-associated kinases, resulting in inhibition of cell proliferation and induction of apoptosis, as well as other events.";
						citations = { 1: "", 2: "", 3: "" };
						break;
					case (hotspot === "fu"):
						content = "5-FU, or 5-fluorouracil, is an antimetabolite that has often been used for the treatment of CRC, either alone or in combination with other cytostatic agents. After being converted to its active metabolite, 5-FdUMP, 5-FU irreversibly blocks TS, ultimately leading to apoptosis.";
						citations = { 1: "", 2: "", 3: "" };
						break;
					case (hotspot === "platinum-based-chemotherapies"):
						content = "Platinum-based chemotherapies include cisplatin, carboplatin, and others. The cytotoxic effects of these drugs are attributed to the formation of platinum-DNA adducts, which cause inter- and intra-strand cross-linking.";
						citations = { 1: "", 2: "", 3: "" };
						break;
					case (hotspot === "irinotecan"):
						content = "Irinotecan interacts specifically with TOPO1. The cytotoxicity of irinotecan is due to double-strand DNA damage produced during DNA synthesis when replication enzymes interact with the complex formed by TOPO1, DNA, and either irinotecan or it’s active metabolite.";
						citations = { 1: "", 2: "", 3: "" };
						break;
					case (hotspot === "egfr"):
						content = "The epidermal growth factor receptor (EGFR) triggers both the RAS-RAF-MAPK and the PI3K-AKT pathways, leading to  increased cell proliferation and increased cell survival. EGFR is expressed on the cell surface of normal cells and is often overexpressed in colorectal cancers.";
						citations = { 
							1: "Sartore-Bianchi, A., et al.  (2007).  \"EGFR gene copy number and clinical outcome of metastatic colorectal cancer treated with Panitumumab.\"  J Clin Oncol 25: 3238-45.", 
							2: "Laurent-Puig, P., F. Penault-Llorca, et al.  (2009).  \"Analysis of PTEN, BRAF, and EGFR Status in Determining Benefit From Cetuximab Therapy in Wild-Type KRAS Metastatic Colon Cancer.\"  J Clin Oncol 27(35): 5924-5930.", 
							3: "" };
						break;
					case (hotspot === "pi3k"):
						content = "The catalytic subunit of PI3K is encoded by the PIK3CA gene. PI3K is a lipid kinase that is normally inhibited by phosphatase and tensin homolog (PTEN). Mutations in PIK3CA are associated with resistance to cetuximab and panitumumab.";
						citations = { 
							1: "Sartore-Bianchi, A., A. Bardelli, et al. (2009).  \"PIK3CA mutations in colorectal cancer are associated with clinical resistance to EGFR-targeted monoclonal antibodies.\" Cancer Res 69(5): 1851-7.", 
							2: "", 
							3: "" };
						break;
					case (hotspot === "ras"):
						content = "Mutations in KRAS are found in a subpopulation of CRC patients. Oncogenic forms of KRAS due to mutations at activating hotspots make KRAS continuously active and independent of EGFR regulation. Consequently, CRC patients having KRAS mutations are resistant to EGFR-targeted therapies, such as panitumumab and cetuximab.";
						citations = { 
							1: "Laurent-Puig, P., F. Penault-Llorca, et al.  (2009).  \"Analysis of PTEN, BRAF, and EGFR Status in Determining Benefit From Cetuximab Therapy in Wild-Type KRAS Metastatic Colon Cancer.\"  J Clin Oncol 27(35): 5924-5930.", 
							2: "Saridaki, Z., J. Souglakos, et al.  (2011).  \"Impact of KRAS, BRAF, PIK3CA Mutations, PTEN, AREG, EREG Expression and Skin Rash in 2nd Line Cetuximab-based Therapy of Colorectal Cancer Patients.\"  PLoS ONE 6(1): e15980. doi:10.1371/journal.pone.0015980.", 
							3: "" };
						break;
					case (hotspot === "raf"):
						content = "Some mutations in BRAF cause its constitutive activation. Monoclonal antibody therapy appears to be only effective against wild-type–BRAF tumors. Patients with BRAF-mutated tumors have a significantly shorter median PFS and median OS than patients with wild-type–BRAF tumors. BRAF and KRAS mutations are mutually exclusive.";
						citations = { 
							1: "Di Nicolantonio, F., et al., Wild-type BRAF is required for response to panitumumab or cetuximab in metastatic colorectal cancer. J Clin Oncol, 2008. 26(35): p. 5705-12.", 
							2: "Saridaki, Z., J. Souglakos, et al.  (2011).  \"Impact of KRAS, BRAF, PIK3CA Mutations, PTEN, AREG, EREG Expression and Skin Rash in 2nd Line Cetuximab-based Therapy of Colorectal Cancer Patients.\"  PLoS ONE 6(1): e15980. doi:10.1371/journal.pone.0015980.", 
							3: "Laurent-Puig, P., F. Penault-Llorca, et al.  (2009).  \"Analysis of PTEN, BRAF, and EGFR Status in Determining Benefit From Cetuximab Therapy in Wild-Type KRAS Metastatic Colon Cancer.\"  J Clin Oncol 27(35): 5924-5930." };
						break;
					case (hotspot === "pten"):
						content = "PTEN, or phosphatase and tensin homolog, inhibits the PI3K-AKT cell survival pathway. Loss of PTEN function is one of the most common occurrences in advanced human cancer. PTEN loss of function is associated with nonresponsiveness to cetuximab, as well as possibly other EGFR inhibitors and panitumumab.";
						citations = { 
							1: "Frattini, M., L. Mazzucchelli, et al.  (2007).  \"PTEN loss of expression predicts cetuximab efficacy in metastatic colorectal cancer patients.\"  Br J Cancer 97: 1139-1145.", 
							2: "Negri, F.V., A. Ardizzoni, et al.  (2010).  \"PTEN status in advanced colorectal cancer treated with cetuximab.\"  Br J Cancer 102: 162-164.", 
							3: "Laurent-Puig, P., F. Penault-Llorca, et al.  (2009).  \"Analysis of PTEN, BRAF, and EGFR Status in Determining Benefit From Cetuximab Therapy in Wild-Type KRAS Metastatic Colon Cancer.\"  J Clin Oncol 27(35): 5924-5930." };
						break;
					case (hotspot === "ts"):
						content = "TS, or thymidylate synthase, converts dUMP to dTMP, making it a key enzyme in the de novo synthesis of DNA. TS is also a target of FdUMP. TS levels are higher in CRC tumors that are unresponsive to 5-FU-based therapies.";
						citations = { 
							1: "Popat, S., Z. Chen, et al. (2006). \"A prospective, blinded analysis of thymidylate synthase and p53 expression as prognostic markers in the adjuvant treatment of colorectal cancer.\" Ann Oncol 17(12): 1810-7.", 
							2: "Paradiso, A., G. Simone, et al. (2000). \"Thymidylate synthase and p53 primary tumour expression as predictive factors for advanced colorectal cancer patients.\" Br J Cancer 82(3): 560-7.", 
							3: "Kim, S.-H., H.-C. Kwon, et al. (2009). \"Prognostic Value of ERCC1, Thymidylate Synthase, and Glutathione S-Transferase [pi] for 5-FU/Oxaliplatin Chemotherapy in Advanced Colorectal Cancer.\" American Journal of Clinical Oncology 32(1): 38-43" };
						break;
					case (hotspot === "ercc1"):
						content = "ERCC1, or excision repair cross-complementation group 1, is a component of the nucleotide excision repair pathway. Overexpression of ERCC1 is associated with resistance to platinum-based therapies.";
						citations = { 
							1: "Paradiso, A., G. Simone, et al. (2000). \"Thymidylate synthase and p53 primary tumour expression as predictive factors for advanced colorectal cancer patients.\" Br J Cancer 82(3): 560-7.", 
							2: "", 
							3: "" };
						break;
					case (hotspot === "top01"):
						content = "TOPO1, or topoisomerase I, is an enzyme that alters the supercoiling of DNA by  transiently creating single-strand breaks. Regulation of DNA supercoiling is essential to DNA transcription and replication, because the DNA helix must unwind to permit the proper functioning of the enzymes involved in DNA replication. Patients with higher levels of TOPO1 may benefit more from irinotecan therapy.";
						citations = { 1: "", 2: "", 3: "" };
						break;
					default:
						content = "Error: could not find: " + hotspot;
						citations = { 1: "", 2: "", 3: "" };
						return;
				}
				break;
				default:
					content = "Error: unspecified type";
					citations = { 1: "", 2: "", 3: "" };
					return;
		}

		eveo.subtumor.showDialogTab(1, hotspot, content, citations, true);
		
	},
	
	/* scene number refers to PDF (currently named CARWEB1068_0301_2012_fileMarkUps (2).pdf) */
	getScene: function(number) {

		var sceneLookup = { }
		sceneLookup[1] = {
			bg: "subtumor-1-4",
			layer: "subtumor-1",
			hotspots: [
				{
					id: "egfr",
					left: "364px",
					top: "90px",
					width: "125px",
					height: "60px"
				},
				{
					id: "pten",
					left: "275px",
					top: "280px",
					width: "140px",
					height: "90px"
				},
				{
					id: "erlotinib",
					left: "470px",
					top: "170px",
					width: "130px",
					height: "80px"
				},
				{
					id: "ras",
					left: "600px",
					top: "215px",
					width: "100px",
					height: "60px"
				},
				{
					id: "crizotinib",
					left: "620px",
					top: "477px",
					width: "120px",
					height: "70px"
				},
				{
					id: "eml4-alk",
					left: "642px",
					top: "365px",
					width: "180px",
					height: "110px"
				}
			]
		};
			
		sceneLookup[2] = {
			bg: "subtumor-1-4",
			layer: "subtumor-2",
			hotspots: [
				{
					id: "trastuzumab",
					left: "266px",
					top: "49px",
					width: "170px",
					height: "70px"
				},
				{
					id: "her2",
					left: "360px",
					top: "88px",
					width: "350px",
					height: "100px"
				},
				{
					id: "lapatinib",
					left: "468px",
					top: "189px",
					width: "150px",
					height: "80px"
				},
				{
					id: "pten",
					left: "275px",
					top: "280px",
					width: "140px",
					height: "90px"
				}
			]
		};
			
		sceneLookup[3] = {
			bg: "subtumor-1-4",
			layer: "subtumor-3",
			hotspots: []
		};
			
		sceneLookup[4] = {
			bg: "subtumor-1-4",
			layer: "subtumor-4",
			hotspots: [
				{
					id: "cetuximab",
					left: "305px",
					top: "45px",
					width: "150px",
					height: "60px"
				},
				{
					id: "panitumumab",
					left: "500px",
					top: "45px",
					width: "220px",
					height: "60px"
				},
				{
					id: "pi3k",
					left: "275px",
					top: "280px",
					width: "140px",
					height: "90px"
				},
				{
					id: "pten",
					left: "370px",
					top: "221px",
					width: "140px",
					height: "90px"
				},
				{
					id: "egfr",
					left: "355px",
					top: "100px",
					width: "125px",
					height: "60px"
				},
				{
					id: "ras",
					left: "600px",
					top: "215px",
					width: "100px",
					height: "60px"
				},
				{
					id: "raf",
					left: "570px",
					top: "300px",
					width: "150px",
					height: "60px"
				}
			]
		};
		
		// the 5th scene varies based on tumor type
		if (eveo.subtumor._type === "breast_tumor" || eveo.subtumor._type === "colon_tumor") {
			sceneLookup[5] = {
				bg: "subtumor-5",
				layer: null,
				hotspots: [
					{
						id: "ts",
						left: "685px",
						top: "300px",
						width: "80px",
						height: "100px"
					},
					{
						id: "fu",
						left: "100px",
						top: "320px",
						width: "100px",
						height: "60px"
					}
				]
			}
		}
		else { // lung
			sceneLookup[5] = {
				bg: "subtumor-5",
				layer: null,
				hotspots: [
					{
						id: "gemcitabine",
						left: "165px",
						top: "210px",
						width: "140px",
						height: "60px"
					},
					{
						id: "rrm1",
						left: "165px",
						top: "265px",
						width: "160px",
						height: "60px"
					},
					{
						id: "pemetrexed",
						left: "550px",
						top: "340px",
						width: "155px",
						height: "60px"
					},
					{
						id: "ts",
						left: "685px",
						top: "300px",
						width: "80px",
						height: "100px"
					}
				]
			}
		}
			
		sceneLookup[6] = {
			bg: "subtumor-6",
			layer: null,
			hotspots: [
				{
					id: "paclitaxel",
					left: "140px",
					top: "135px",
					width: "140px",
					height: "110px"
				},
				{
					id: "docetaxel",
					left: "297px",
					top: "90px",
					width: "140px",
					height: "110px"
				},
				{
					id: "nab-paclitaxel",
					left: "529px",
					top: "70px",
					width: "210px",
					height: "90px"
				},
				{
					id: "sparc",
					left: "555px",
					top: "160px",
					width: "150px",
					height: "70px"
				},
				{
					id: "pgp",
					left: "670px",
					top: "240px",
					width: "150px",
					height: "70px"
				},
				{
					id: "tubb3",
					left: "345px",
					top: "585px",
					width: "150px",
					height: "70px"
				},
				{
					id: "tle3",
					left: "500px",
					top: "580px",
					width: "150px",
					height: "70px"
				}
			]
		};
			
		sceneLookup[7] = {
			bg: "subtumor-7",
			layer: null,
			hotspots: [
				{
					id: "paclitaxel",
					left: "140px",
					top: "135px",
					width: "140px",
					height: "110px"
				},
				{
					id: "docetaxel",
					left: "380px",
					top: "75px",
					width: "140px",
					height: "110px"
				},
				{
					id: "pgp",
					left: "670px",
					top: "240px",
					width: "150px",
					height: "70px"
				},
				{
					id: "tubb3",
					left: "345px",
					top: "585px",
					width: "150px",
					height: "70px"
				}
			]
		};
			
		sceneLookup[8] = {
			bg: "subtumor-8-9",
			layer: "subtumor-8",
			hotspots: [
				{
					id: "top01",
					left: "415px",
					top: "240px",
					width: "140px",
					height: "70px"
				},
				{
					id: "irinotecan",
					left: "454px",
					top: "175px",
					width: "160px",
					height: "65px"
				},
				{
					id: "ercc1",
					left: "475px",
					top: "400px",
					width: "150px",
					height: "80px"
				},
				{
					id: "platinum-based-chemo",
					left: "625px",
					top: "400px",
					width: "220px",
					height: "80px"
				}
			]
		};
			
		sceneLookup[9] = {
			bg: "subtumor-8-9",
			layer: "subtumor-9",
			hotspots: [
				{
					id: "anthracyclines",
					left: "457px",
					top: "180px",
					width: "200px",
					height: "70px"
				},
				{
					id: "top2a",
					left: "443px",
					top: "255px",
					width: "150px",
					height: "70px"
				}
			]
		}

		
		return sceneLookup[number];
		
	},
	
	/* set scene based on tumor type and biomarker passed in via query params
			scene number refers to PDF */
	setScene: function(type, biomarker) {
		
		var scene = null;

		/* TODO: switch based on type, biomarker */
		switch(true) {
			case (type === "breast_tumor"):
				switch(true) {
					case (biomarker === "her2"):
					case (biomarker === "pi3k"):
					case (biomarker === "pten"):
						scene = eveo.subtumor.getScene(2);
						break;
					case (biomarker === "ts"):
						scene = eveo.subtumor.getScene(5);
						break;
					case (biomarker === "sparc"):
					case (biomarker === "tubb3"):
					case (biomarker === "tle3"):
					case (biomarker === "pgp"):
						scene = eveo.subtumor.getScene(6);
						break;
					case (biomarker === "top2a"):
						scene = eveo.subtumor.getScene(9);
						break;
					default:
						alert(biomarker.toUpperCase() + " biomarker does not exist for breast.")
						break;
				}
				break;
			case (type === "lung_tumor"):
				switch(true) {
					case (biomarker === "egfr"):
					case (biomarker === "alk"):
					case (biomarker === "kras"):
					case (biomarker === "pten"):
						scene = eveo.subtumor.getScene(1);
						break;
					case (biomarker === "ts"):
					case (biomarker === "rrm1"):
						scene = eveo.subtumor.getScene(5);
						break;
					case (biomarker === "tubb3"):
					case (biomarker === "pgp"):
						scene = eveo.subtumor.getScene(7);
						break;
					default:
						alert(biomarker.toUpperCase() + " biomarker does not exist for lung.")
						break;
				}
				break;
			case (type === "colon_tumor"):
				switch(true) {
					case (biomarker === "egfr"):
					case (biomarker === "pi3k"):
					case (biomarker === "kras"):
					case (biomarker === "pten"):
					case (biomarker === "braf"):
						scene = eveo.subtumor.getScene(4);
						break;
					case (biomarker === "ts"):
						scene = eveo.subtumor.getScene(5);
						break;
					case (biomarker === "ercc1"):
					case (biomarker === "top01"):
						scene = eveo.subtumor.getScene(8);
						break;
					default:
						alert(biomarker.toUpperCase() + " biomarker does not exist for colon.")
						break;
				}
				break;
			default:
				alert("error: unspecified type");
				break;
		}
		
		if (scene) {
			eveo.library.addClassName(document.body, scene.bg);
			if (scene.layer) {
				eveo.library.addClassName("subtumor-layer", scene.layer);
			}
			if (scene.hotspots) {
				var iterator = scene.hotspots.length;
				while (iterator--) {
					eveo.subtumor.createHotspot(
						scene.hotspots[iterator].id,
						scene.hotspots[iterator].left,
						scene.hotspots[iterator].top,
						scene.hotspots[iterator].width,
						scene.hotspots[iterator].height
					);
				}
			}
		}
	},
	
	/* create a hotspot around the label and/or internals */
	createHotspot: function(id, left, top, width, height) {

		var hotspot = document.createElement('div');
		
		hotspot.setAttribute('id', id);
		hotspot.className = 'hotspot';
		
		if (width) { hotspot.style.width = width; }
		if (height) { hotspot.style.height = height; }
		if (left) { hotspot.style.left = left; }
		if (top) { hotspot.style.top = top; }

		if (eveo.caris._isTouchDevice) {
			eveo.library.addEvent(hotspot, "touchstart", eveo.subtumor.hotspotClicked);
		}
		else {
			eveo.library.addEvent(hotspot, "click", eveo.subtumor.hotspotClicked);
		}

		eveo.subtumor._hotspots.appendChild(hotspot);
	},
	
	/* set inside of tumor background image based on params, "tumor" & "biomarker" 
			and show popup for biomarker
	*/
	load: function() {

		eveo.subtumor._type = eveo.caris.getParameterByName("tumor").toLowerCase();
		eveo.subtumor._biomarker = eveo.caris.getParameterByName("biomarker").toLowerCase();
		eveo.subtumor._hotspots = document.getElementById("hotspots");
		eveo.subtumor._dialog = document.getElementById("dialog");

		eveo.subtumor.setScene(eveo.subtumor._type, eveo.subtumor._biomarker);

		// add events for switching tabs on popup
		if (eveo.caris._isTouchDevice) {
			eveo.library.addEvent("dialog-tab-2", "touchstart", function() { eveo.subtumor.showDialogTab(1,null,null,null,true) });
			eveo.library.addEvent("dialog-tab-1", "touchstart", function() { eveo.subtumor.showDialogTab(2,null,null,null,true) });
			eveo.caris.simulateTouch(eveo.subtumor._biomarker);	// show popup for biomarker 
		}
		else {
			eveo.library.addEvent("dialog-tab-2", "mousedown", function() { eveo.subtumor.showDialogTab(1,null,null,null,true) });
			eveo.library.addEvent("dialog-tab-1", "mousedown", function() { eveo.subtumor.showDialogTab(2,null,null,null,true) });
			eveo.caris.simulateClick(eveo.subtumor._biomarker); // show popup for biomarker
		}

	}

}

ready.push(eveo.subtumor.load);