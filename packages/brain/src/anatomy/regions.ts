export type RegionKind =
  | "System" | "Organ" | "Division" | "Lobe" | "Structure" | "Region"
  | "CorticalRegion" | "CorticalArea" | "RegionGroup" | "Substructure"
  | "Nucleus" | "NucleiGroup" | "Network" | "FunctionalRegion"
  | "WhiteMatterTract" | "CranialNerve" | "SensoryStructure" | "SensoryGanglion";

export interface RegionDefinition {
  readonly name: string;
  readonly kind: RegionKind;
  readonly parentId: string | null;
  readonly functions: readonly string[];
  readonly description: string;
}

export const regions = {
  central_nervous_system: {"name": "Central nervous system", "kind": "System", "parentId": null, "functions": ["integration", "control"], "description": "The brain and spinal cord; the registry models brain structures and selected spinal interfaces."},
  brain: {"name": "Brain", "kind": "Organ", "parentId": "central_nervous_system", "functions": ["sensory processing", "motor control", "homeostasis", "cognition"], "description": "Top-level organ node."},
  telencephalon: {"name": "Telencephalon", "kind": "Division", "parentId": "brain", "functions": ["cognition", "perception", "voluntary action"], "description": "Includes cerebral hemispheres and basal forebrain structures."},
  diencephalon: {"name": "Diencephalon", "kind": "Division", "parentId": "brain", "functions": ["sensory relay", "homeostasis", "endocrine regulation"], "description": "Includes thalamus, hypothalamus, epithalamus and subthalamus."},
  brainstem: {"name": "Brainstem", "kind": "Division", "parentId": "brain", "functions": ["arousal", "autonomic regulation", "cranial nerve functions"], "description": "Midbrain, pons and medulla oblongata."},
  cerebellum: {"name": "Cerebellum", "kind": "Division", "parentId": "brain", "functions": ["coordination", "motor learning", "timing", "balance"], "description": "Cerebellar cortex and deep nuclei."},
  cerebral_hemispheres: {"name": "Cerebral hemispheres", "kind": "Structure", "parentId": "telencephalon", "functions": ["higher-order processing"], "description": "Left and right hemispheres are not expanded as separate copies in this baseline."},
  cerebral_cortex: {"name": "Cerebral cortex", "kind": "Structure", "parentId": "cerebral_hemispheres", "functions": ["perception", "planning", "language", "voluntary movement"], "description": "Layered sheet of neocortex and allocortex; this registry focuses on selected regions."},
  frontal_lobe: {"name": "Frontal lobe", "kind": "Lobe", "parentId": "cerebral_cortex", "functions": ["executive function", "planning", "voluntary movement", "language production"], "description": "Includes prefrontal and motor regions."},
  prefrontal_cortex: {"name": "Prefrontal cortex", "kind": "CorticalRegion", "parentId": "frontal_lobe", "functions": ["working memory", "planning", "decision making", "cognitive control"], "description": "Broad prefrontal territory; subdivisions are represented below."},
  dorsolateral_prefrontal_cortex: {"name": "Dorsolateral prefrontal cortex", "kind": "CorticalRegion", "parentId": "prefrontal_cortex", "functions": ["working memory", "planning", "cognitive control"], "description": "Functional territory; boundaries vary by parcellation."},
  ventromedial_prefrontal_cortex: {"name": "Ventromedial prefrontal cortex", "kind": "CorticalRegion", "parentId": "prefrontal_cortex", "functions": ["valuation", "social cognition", "emotion regulation"], "description": "Functional territory."},
  orbitofrontal_cortex: {"name": "Orbitofrontal cortex", "kind": "CorticalRegion", "parentId": "prefrontal_cortex", "functions": ["value representation", "decision making", "reward processing"], "description": "Functional territory."},
  primary_motor_cortex: {"name": "Primary motor cortex", "kind": "CorticalArea", "parentId": "frontal_lobe", "functions": ["voluntary movement execution"], "description": "Precentral gyrus; commonly associated with Brodmann area 4."},
  premotor_cortex: {"name": "Premotor cortex", "kind": "CorticalRegion", "parentId": "frontal_lobe", "functions": ["movement planning", "sensorimotor transformation"], "description": "Includes lateral premotor territories."},
  supplementary_motor_area: {"name": "Supplementary motor area", "kind": "CorticalRegion", "parentId": "frontal_lobe", "functions": ["movement sequencing", "internally guided movement"], "description": "Medial frontal motor territory."},
  brocas_area: {"name": "Broca region", "kind": "CorticalRegion", "parentId": "frontal_lobe", "functions": ["speech production", "language planning"], "description": "Usually associated with parts of the dominant inferior frontal gyrus; not a single universal point."},
  parietal_lobe: {"name": "Parietal lobe", "kind": "Lobe", "parentId": "cerebral_cortex", "functions": ["somatosensation", "spatial attention", "multisensory integration"], "description": "Includes primary and association somatosensory territories."},
  primary_somatosensory_cortex: {"name": "Primary somatosensory cortex", "kind": "CorticalArea", "parentId": "parietal_lobe", "functions": ["touch", "proprioception", "somatic sensation"], "description": "Postcentral gyrus; commonly associated with Brodmann areas 3, 1 and 2."},
  posterior_parietal_cortex: {"name": "Posterior parietal cortex", "kind": "CorticalRegion", "parentId": "parietal_lobe", "functions": ["spatial attention", "sensorimotor integration", "body schema"], "description": "Broad association territory."},
  precuneus: {"name": "Precuneus", "kind": "CorticalRegion", "parentId": "parietal_lobe", "functions": ["visuospatial imagery", "self-related processing", "memory"], "description": "Medial parietal association cortex."},
  temporal_lobe: {"name": "Temporal lobe", "kind": "Lobe", "parentId": "cerebral_cortex", "functions": ["auditory processing", "memory", "language comprehension"], "description": "Includes auditory, medial temporal and association regions."},
  primary_auditory_cortex: {"name": "Primary auditory cortex", "kind": "CorticalArea", "parentId": "temporal_lobe", "functions": ["auditory perception"], "description": "Located on Heschl's gyrus; commonly associated with Brodmann areas 41 and 42."},
  superior_temporal_gyrus: {"name": "Superior temporal gyrus", "kind": "CorticalRegion", "parentId": "temporal_lobe", "functions": ["auditory association", "language processing"], "description": "Includes multiple functionally distinct territories."},
  wernickes_region: {"name": "Wernicke-related language network", "kind": "CorticalRegion", "parentId": "temporal_lobe", "functions": ["language comprehension"], "description": "A network-level label; exact anatomical definition varies across literature."},
  inferior_temporal_cortex: {"name": "Inferior temporal cortex", "kind": "CorticalRegion", "parentId": "temporal_lobe", "functions": ["visual object recognition"], "description": "High-level ventral visual pathway territory."},
  medial_temporal_lobe: {"name": "Medial temporal lobe", "kind": "RegionGroup", "parentId": "temporal_lobe", "functions": ["episodic memory", "memory consolidation"], "description": "Includes hippocampal formation and adjacent cortices."},
  hippocampal_formation: {"name": "Hippocampal formation", "kind": "Structure", "parentId": "medial_temporal_lobe", "functions": ["episodic memory", "spatial memory"], "description": "Includes hippocampus proper, dentate gyrus and subiculum."},
  hippocampus: {"name": "Hippocampus", "kind": "Structure", "parentId": "hippocampal_formation", "functions": ["memory encoding", "memory consolidation", "spatial navigation"], "description": "Anatomical formation; not a single-purpose memory switch."},
  dentate_gyrus: {"name": "Dentate gyrus", "kind": "Substructure", "parentId": "hippocampal_formation", "functions": ["pattern separation", "memory processing"], "description": "Hippocampal formation subregion."},
  subiculum: {"name": "Subiculum", "kind": "Substructure", "parentId": "hippocampal_formation", "functions": ["hippocampal output", "spatial and memory processing"], "description": "Major hippocampal output region."},
  entorhinal_cortex: {"name": "Entorhinal cortex", "kind": "CorticalRegion", "parentId": "medial_temporal_lobe", "functions": ["memory", "spatial navigation"], "description": "Interface between neocortical association areas and hippocampal formation."},
  parahippocampal_cortex: {"name": "Parahippocampal cortex", "kind": "CorticalRegion", "parentId": "medial_temporal_lobe", "functions": ["contextual memory", "scene processing"], "description": "Medial temporal cortical region."},
  amygdala: {"name": "Amygdala", "kind": "Structure", "parentId": "telencephalon", "functions": ["salience", "emotional learning", "threat processing"], "description": "Complex of nuclei; not a unitary fear center."},
  basal_ganglia: {"name": "Basal ganglia", "kind": "System", "parentId": "telencephalon", "functions": ["action selection", "motor control", "learning"], "description": "Functional grouping of interconnected nuclei."},
  striatum: {"name": "Striatum", "kind": "Structure", "parentId": "basal_ganglia", "functions": ["action selection", "reinforcement learning"], "description": "Includes caudate and putamen; ventral striatum is related."},
  caudate_nucleus: {"name": "Caudate nucleus", "kind": "Nucleus", "parentId": "striatum", "functions": ["goal-directed action", "associative learning"], "description": "Dorsal striatal nucleus."},
  putamen: {"name": "Putamen", "kind": "Nucleus", "parentId": "striatum", "functions": ["motor and habit-related loops"], "description": "Dorsal striatal nucleus."},
  globus_pallidus: {"name": "Globus pallidus", "kind": "Structure", "parentId": "basal_ganglia", "functions": ["basal ganglia output and modulation"], "description": "External and internal segments are not separately modeled here."},
  subthalamic_nucleus: {"name": "Subthalamic nucleus", "kind": "Nucleus", "parentId": "diencephalon", "functions": ["basal ganglia circuit modulation"], "description": "Functionally part of basal ganglia loops."},
  substantia_nigra: {"name": "Substantia nigra", "kind": "Structure", "parentId": "brainstem", "functions": ["dopaminergic modulation", "motor circuit regulation"], "description": "Includes pars compacta and pars reticulata."},
  thalamus: {"name": "Thalamus", "kind": "Structure", "parentId": "diencephalon", "functions": ["sensory relay", "cortical coordination", "attention"], "description": "Multiple nuclei with distinct connections; represented as a parent node."},
  lateral_geniculate_nucleus: {"name": "Lateral geniculate nucleus", "kind": "Nucleus", "parentId": "thalamus", "functions": ["visual relay"], "description": "Thalamic visual relay nucleus."},
  medial_geniculate_nucleus: {"name": "Medial geniculate nucleus", "kind": "Nucleus", "parentId": "thalamus", "functions": ["auditory relay"], "description": "Thalamic auditory relay nucleus."},
  ventral_posterior_nucleus: {"name": "Ventral posterior thalamic nuclei", "kind": "Nucleus", "parentId": "thalamus", "functions": ["somatosensory relay"], "description": "Includes VPL and VPM territories."},
  hypothalamus: {"name": "Hypothalamus", "kind": "Structure", "parentId": "diencephalon", "functions": ["homeostasis", "autonomic regulation", "endocrine control"], "description": "Complex of nuclei coordinating autonomic, endocrine and behavioral functions."},
  pituitary_gland: {"name": "Pituitary gland", "kind": "Organ", "parentId": "brain", "functions": ["endocrine signaling"], "description": "Connected to hypothalamus; anatomically an endocrine gland, not brain tissue proper."},
  epithalamus: {"name": "Epithalamus", "kind": "Structure", "parentId": "diencephalon", "functions": ["circadian and limbic-related functions"], "description": "Includes habenular complex and pineal gland."},
  pineal_gland: {"name": "Pineal gland", "kind": "Organ", "parentId": "epithalamus", "functions": ["melatonin secretion", "circadian timing"], "description": "Endocrine organ."},
  midbrain: {"name": "Midbrain", "kind": "Structure", "parentId": "brainstem", "functions": ["orienting", "motor modulation", "arousal"], "description": "Mesencephalon."},
  superior_colliculus: {"name": "Superior colliculus", "kind": "Structure", "parentId": "midbrain", "functions": ["visual orienting", "saccades"], "description": "Midbrain tectal structure."},
  inferior_colliculus: {"name": "Inferior colliculus", "kind": "Structure", "parentId": "midbrain", "functions": ["auditory processing"], "description": "Major auditory midbrain nucleus."},
  periaqueductal_gray: {"name": "Periaqueductal gray", "kind": "Region", "parentId": "midbrain", "functions": ["defensive behavior", "pain modulation", "autonomic coordination"], "description": "Midbrain region around cerebral aqueduct."},
  pons: {"name": "Pons", "kind": "Structure", "parentId": "brainstem", "functions": ["relay", "sleep and arousal", "cranial nerve functions"], "description": "Brainstem subdivision."},
  medulla_oblongata: {"name": "Medulla oblongata", "kind": "Structure", "parentId": "brainstem", "functions": ["cardiorespiratory regulation", "reflexes"], "description": "Caudal brainstem subdivision."},
  reticular_formation: {"name": "Reticular formation", "kind": "Network", "parentId": "brainstem", "functions": ["arousal", "state regulation", "autonomic functions"], "description": "Distributed brainstem network, not a sharply bounded nucleus."},
  locus_coeruleus: {"name": "Locus coeruleus", "kind": "Nucleus", "parentId": "pons", "functions": ["noradrenergic modulation", "arousal"], "description": "Pontine nucleus."},
  raphe_nuclei: {"name": "Raphe nuclei", "kind": "NucleiGroup", "parentId": "brainstem", "functions": ["serotonergic modulation"], "description": "Distributed brainstem nuclei."},
  ventral_tegmental_area: {"name": "Ventral tegmental area", "kind": "Region", "parentId": "midbrain", "functions": ["dopaminergic modulation", "reward learning"], "description": "Midbrain region."},
  nucleus_tractus_solitarius: {"name": "Nucleus of the solitary tract", "kind": "Nucleus", "parentId": "medulla_oblongata", "functions": ["visceral sensory integration"], "description": "Receives visceral afferent information."},
  cerebellar_cortex: {"name": "Cerebellar cortex", "kind": "Structure", "parentId": "cerebellum", "functions": ["coordination", "prediction", "motor learning"], "description": "Layered cerebellar cortex."},
  vermis: {"name": "Cerebellar vermis", "kind": "Region", "parentId": "cerebellar_cortex", "functions": ["posture", "gait", "axial control"], "description": "Midline cerebellar cortex."},
  cerebellar_hemispheres: {"name": "Cerebellar hemispheres", "kind": "Region", "parentId": "cerebellar_cortex", "functions": ["limb coordination", "cognitive contributions"], "description": "Lateral cerebellar territories."},
  deep_cerebellar_nuclei: {"name": "Deep cerebellar nuclei", "kind": "NucleiGroup", "parentId": "cerebellum", "functions": ["cerebellar output"], "description": "Includes dentate, interposed and fastigial nuclei."},
  dentate_nucleus: {"name": "Dentate nucleus", "kind": "Nucleus", "parentId": "deep_cerebellar_nuclei", "functions": ["planning and coordination"], "description": "Largest deep cerebellar nucleus."},
  vestibulocerebellum: {"name": "Vestibulocerebellum", "kind": "FunctionalRegion", "parentId": "cerebellum", "functions": ["balance", "eye movement"], "description": "Flocculonodular lobe and related circuitry."},
  corpus_callosum: {"name": "Corpus callosum", "kind": "WhiteMatterTract", "parentId": "cerebral_hemispheres", "functions": ["interhemispheric communication"], "description": "Major commissural white-matter tract."},
  internal_capsule: {"name": "Internal capsule", "kind": "WhiteMatterTract", "parentId": "telencephalon", "functions": ["corticofugal and thalamocortical transmission"], "description": "Major projection-fiber corridor."},
  fornix: {"name": "Fornix", "kind": "WhiteMatterTract", "parentId": "telencephalon", "functions": ["hippocampal output"], "description": "Major efferent pathway of hippocampal formation."},
  optic_nerve: {"name": "Optic nerve", "kind": "CranialNerve", "parentId": "brain", "functions": ["visual input"], "description": "Retinal ganglion-cell axons; technically cranial nerve II."},
  retina: {"name": "Retina", "kind": "SensoryStructure", "parentId": "brain", "functions": ["phototransduction", "visual preprocessing"], "description": "Neural tissue of the eye; included as an input boundary, not brain tissue."},
  cochlea: {"name": "Cochlea", "kind": "SensoryStructure", "parentId": "brain", "functions": ["auditory transduction"], "description": "Inner-ear sensory structure; included as an input boundary."},
  spinal_cord: {"name": "Spinal cord", "kind": "Structure", "parentId": "central_nervous_system", "functions": ["sensorimotor transmission", "reflexes"], "description": "Included as a boundary node for ascending and descending pathways."},
  dorsal_root_ganglion: {"name": "Dorsal root ganglion", "kind": "SensoryGanglion", "parentId": "spinal_cord", "functions": ["somatic and visceral afferents"], "description": "Peripheral sensory neuron cell bodies; outside brain proper."},
  primary_visual_cortex: {"name": "Primary visual cortex", "kind": "CorticalArea", "parentId": "cerebral_cortex", "functions": ["visual perception"], "description": "V1; occipital cortex; commonly associated with Brodmann area 17."},
  visual_association_cortex: {"name": "Visual association cortex", "kind": "CorticalRegion", "parentId": "cerebral_cortex", "functions": ["visual interpretation", "object and motion processing"], "description": "Includes multiple extrastriate territories."},
  cingulate_cortex: {"name": "Cingulate cortex", "kind": "CorticalRegion", "parentId": "cerebral_cortex", "functions": ["motivation", "pain-related processing", "cognitive control"], "description": "Medial cortical region with multiple subdivisions."},
  insula: {"name": "Insular cortex", "kind": "CorticalRegion", "parentId": "cerebral_cortex", "functions": ["interoception", "taste", "salience"], "description": "Buried cortical region."},
  olfactory_bulb: {"name": "Olfactory bulb", "kind": "Structure", "parentId": "telencephalon", "functions": ["olfactory processing"], "description": "Receives input from olfactory receptor neurons."},
  olfactory_cortex: {"name": "Primary olfactory cortex", "kind": "CorticalRegion", "parentId": "telencephalon", "functions": ["olfactory perception"], "description": "Includes piriform cortex and related regions."},
  nucleus_accumbens: {"name": "Nucleus accumbens", "kind": "Nucleus", "parentId": "striatum", "functions": ["motivation", "reinforcement"], "description": "Ventral striatal structure."},
} as const satisfies Record<string, RegionDefinition>;

export type RegionId = keyof typeof regions;
export type Region = (typeof regions)[RegionId];

export function isRegionId(value: string): value is RegionId {
  return Object.hasOwn(regions, value);
}
