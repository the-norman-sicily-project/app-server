const placesQuery = `
query getPlaces
  @config(
    graph: [
      "http://www.normansicily.org/nsp/ontology"
      "http://www.normansicily.org/nsp/places"
      "http://www.normansicily.org/nsp/locations"
    ]
  ) {
  nsp_Place @type {
    nsp_id
    iri
    rdfs_label @hide
    labels @bind(to: "concat(lang($rdfs_label), ',', $rdfs_label)")
    nsp_placeType

    nsp_hasLocation @hide {
      nsp_Location @type {
        wgs_lat
        wgs_long
        wgs_alt
      }
    }

    ... on nsp_Monastery {
      nsp_monasticIdentity @optional
    }
  }
}`;

const placeQuery = `
query getPlace($placeId: String!, $placeType: String!)
  @config(
    graph: [
      "http://www.normansicily.org/nsp/cssi-assessments"
      "http://www.normansicily.org/nsp/places"
      "http://www.normansicily.org/nsp/locations"
      "http://www.normansicily.org/nsp/links"
      "http://www.normansicily.org/nsp/ontology"
      "http://www.normansicily.org/nsp/people"
      "http://www.normansicily.org/nsp/places"
      "http://www.normansicily.org/nsp/references"
    ]
  ) {
  nsp_Place(nsp_id: $placeId, nsp_placeType: $placeType) @type {
    iri
    nsp_id
    rdfs_label @hide
    labels @bind(to: "concat(lang($rdfs_label), ',', $rdfs_label)")
    nsp_placeType
    skos_prefLabel
    nsp_hasLocation {
      nsp_Location @type {
        rdfs_seeAlso
        wgs_lat
        wgs_long
        nsp_coordinateSource
        geo_hasGeometry {
          geo_asWKT
        }
        nsp_modernComune
        nsp_modernProvince
        nsp_historicalProvince
        nsp_locationHighLoc @optional
        wgs_alt @optional
        nsp_seismicCode @optional
        skos_altLabel @optional
      }
    }
    nsp_updatedOn
    nsp_createdOn
    nsp_recordStatus
    nsp_notes
    nsp_attestationType
    nsp_updatedBy {
      foaf_Person @type {
        foaf_familyName
        foaf_givenName
        foaf_mbox @optional
        foaf_website @optional
      }
    }
    nsp_createdBy {
      foaf_Person @type {
        foaf_familyName
        foaf_givenName
        foaf_mbox @optional
        foaf_website @optional
      }
    }

    skos_altLabel @optional
    nsp_fieldVisit @optional
    nsp_uncorroboratedInformation @optional {
      nsp_UncorroboratedInformation @type {
        nsp_content
        nsp_source
      }
    }
    nsp_earliestSurvivingRecord @optional {
      nsp_EarliestSurvivingRecord @type {
        rdfs_label
        nsp_minYear
        nsp_maxYear
      }
    }
    nsp_hasReference @optional {
      nsp_Reference @type {
        nsp_zoteroIri
        nsp_pages
        nsp_notes
      }
    }
    nsp_hasLink @optional {
      nsp_Link @type {
        nsp_role
        nsp_hasSource {
          iri
          skos_prefLabel
        }
        nsp_hasTarget {
          iri
          skos_prefLabel
        }
        nsp_hasReference {
          nsp_Reference @type {
            nsp_zoteroIri
            nsp_pages
            nsp_notes
          }
        }
      }
    }
    ... on nsp_Monastery {
      nsp_probableStatus
      nsp_probableGender
      nsp_subjectOfDedication
      nsp_monasticIdentity
    }
    cssi_hasAssessment @optional {
      cssi_Assessment @type {
        iri
        cssi_description
        cssi_rockType
        cssi_assessmentDate
        cssi_rockCoatingNotationNotes
        cssi_naturalProcessType
        cssi_siteSettingScore
        cssi_weaknessScore
        cssi_largeErosionScore
        cssi_smallErosionScore
        cssi_rockCoatingsScore
        cssi_totalAssessmentScore
        cssi_otherConcernsScore
        cssi_grandTotalAssessmentScore
        cssi_assessedBy {
          foaf_Person @type {
            foaf_familyName
            foaf_givenName
            foaf_mbox @optional
            foaf_website @optional
          }
        }
        cssi_hasRockCoatingNotation {
          ... on cssi_Droppings {
            droppings: cssi_rockCoatingNotationAnswer
          }
          ... on cssi_DustCoatings {
            dustCoatings: cssi_rockCoatingNotationAnswer
          }
          ... on cssi_IronFilm {
            ironFilm: cssi_rockCoatingNotationAnswer
          }
          ... on cssi_Lithobionts {
            lithobionts: cssi_rockCoatingNotationAnswer
          }
          ... on cssi_Pollution {
            pollution: cssi_rockCoatingNotationAnswer
          }
          ... on cssi_RockVarnish {
            rockVarnish: cssi_rockCoatingNotationAnswer
          }
        }
      }
    }
  }
}`;

const searchPlaceNamesQuery = `query searchPlaceGraph($textToFind:String!)@config(graph:["http://www.normansicily.org/nsp/ontology" "http://www.normansicily.org/nsp/places" "http://www.normansicily.org/nsp/locations"]){nsp_Place @type{rdfs_label @filter(if:"contains(lcase($rdfs_label), lcase($textToFind))")nsp_hasLocation @hide{nsp_Location @type{wgs_lat wgs_long}}}}`;

module.exports = { placesQuery, placeQuery, searchPlaceNamesQuery };
