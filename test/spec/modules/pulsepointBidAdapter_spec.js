/* eslint dot-notation:0, quote-props:0 */
import {expect} from 'chai';
import {spec} from 'modules/pulsepointBidAdapter.js';
import {deepClone} from 'src/utils.js';
import { config } from 'src/config.js';

describe('PulsePoint Adapter Tests', function () {
  const slotConfigs = [{
    placementCode: '/DfpAccount1/slot1',
    mediaTypes: {
      banner: {
        sizes: [[728, 90], [160, 600]]
      }
    },
    bidId: 'bid12345',
    params: {
      cp: 'p10000',
      ct: 't10000',
      cf: '300x250'
    }
  }, {
    placementCode: '/DfpAccount2/slot2',
    mediaTypes: {
      banner: {
        sizes: [[728, 90]]
      }
    },
    bidId: 'bid23456',
    params: {
      cp: 'p10000',
      ct: 't20000',
      cf: '728x90'
    }
  }];
  const nativeSlotConfig = [{
    placementCode: '/DfpAccount1/slot3',
    bidId: 'bid12345',
    nativeParams: {
      title: { required: true, len: 200 },
      image: { wmin: 100 },
      sponsoredBy: { }
    },
    params: {
      cp: 'p10000',
      ct: 't10000'
    }
  }];
  const appSlotConfig = [{
    placementCode: '/DfpAccount1/slot3',
    bidId: 'bid12345',
    params: {
      cp: 'p10000',
      ct: 't10000',
      app: {
        bundle: 'com.pulsepoint.apps',
        storeUrl: 'https://pulsepoint.com/apps',
        domain: 'pulsepoint.com',
      }
    }
  }];
  const videoSlotConfig = [{
    placementCode: '/DfpAccount1/slotVideo',
    bidId: 'bid12345',
    params: {
      cp: 'p10000',
      ct: 't10000',
      video: {
        w: 400,
        h: 300,
        minduration: 5,
        maxduration: 10,
        startdelay: 0,
        skip: 1,
        minbitrate: 200,
        protocols: [1, 2, 4]
      }
    }
  }];
  const additionalParamsConfig = [{
    placementCode: '/DfpAccount1/slot1',
    mediaTypes: {
      banner: {
        sizes: [[1, 1]]
      }
    },
    bidId: 'bid12345',
    params: {
      cp: 'p10000',
      ct: 't10000',
      cf: '1x1',
      extra_key1: 'extra_val1',
      extra_key2: 12345,
      extra_key3: {
        key1: 'val1',
        key2: 23456,
      },
      extra_key4: [1, 2, 3]
    }
  }];

  const ortbParamsSlotConfig = [{
    placementCode: '/DfpAccount1/slot1',
    mediaTypes: {
      banner: {
        sizes: [[1, 1]]
      }
    },
    bidId: 'bid12345',
    params: {
      cp: 'p10000',
      ct: 't10000',
      cf: '1x1',
      bcat: ['IAB-1', 'IAB-20'],
      battr: [1, 2, 3],
      bidfloor: 1.5,
      badv: ['cocacola.com', 'lays.com']
    }
  }, {
    placementCode: '/DfpAccount1/slotVideo',
    bidId: 'bid12345',
    params: {
      cp: 'p10000',
      ct: 't10000',
      video: {
        w: 400,
        h: 300,
        minduration: 5,
        maxduration: 10,
      },
      battr: [2, 3, 4],
      bidfloor: 2.5,
    }
  }];

  const outstreamSlotConfig = [{
    placementCode: '/DfpAccount1/slot1',
    mediaTypes: {
      video: {
        playerSize: [640, 480],
        context: 'outstream'
      }
    },
    bidId: 'bid12345',
    params: {
      cp: 'p10000',
      ct: 't10000',
      cf: '1x1',
      video: {
        h: 300,
        w: 400,
        minduration: 1,
        maxduration: 210,
        linearity: 1,
      }
    },
    renderer: {
      options: {
        text: 'PulsePoint Outstream'
      }
    }
  }];

  const schainParamsSlotConfig = [{
    placementCode: '/DfpAccount1/slot1',
    mediaTypes: {
      banner: {
        sizes: [[1, 1]]
      }
    },
    bidId: 'bid12345',
    params: {
      cp: 'p10000',
      ct: 't10000',
      cf: '1x1',
      bcat: ['IAB-1', 'IAB-20'],
      battr: [1, 2, 3],
      bidfloor: 1.5,
      badv: ['cocacola.com', 'lays.com']
    },
    schain: {
      'ver': '1.0',
      'complete': 1,
      'nodes': [
        {
          'asi': 'exchange1.com',
          'sid': '1234',
          'hp': 1,
          'rid': 'bid-request-1',
          'name': 'publisher',
          'domain': 'publisher.com'
        }
      ]
    },
  }];

  const bidderRequest = {
    refererInfo: {
      page: 'https://publisher.com/home',
      ref: 'https://referrer'
    }
  };

  it('Verify build request', function () {
    const request = spec.buildRequests(slotConfigs, bidderRequest);
    expect(request.url).to.equal('https://bid.contextweb.com/header/ortb?src=prebid');
    expect(request.method).to.equal('POST');
    const ortbRequest = request.data;
    // site object
    expect(ortbRequest.site).to.not.equal(null);
    expect(ortbRequest.site.publisher).to.not.equal(null);
    expect(ortbRequest.site.publisher.id).to.equal('p10000');
    expect(ortbRequest.site.ref).to.equal(bidderRequest.refererInfo.ref);
    expect(ortbRequest.site.page).to.equal('https://publisher.com/home');
    expect(ortbRequest.imp).to.have.lengthOf(2);
    // device object
    expect(ortbRequest.device).to.not.equal(null);
    expect(ortbRequest.device.ua).to.equal(navigator.userAgent);
    // slot 1
    expect(ortbRequest.imp[0].tagid).to.equal('t10000');
    expect(ortbRequest.imp[0].banner).to.not.equal(null);
    expect(ortbRequest.imp[0].banner.w).to.equal(300);
    expect(ortbRequest.imp[0].banner.h).to.equal(250);
    // slot 2
    expect(ortbRequest.imp[1].tagid).to.equal('t20000');
    expect(ortbRequest.imp[1].banner).to.not.equal(null);
    expect(ortbRequest.imp[1].banner.w).to.equal(728);
    expect(ortbRequest.imp[1].banner.h).to.equal(90);
  });

  it('Verify parse response', function () {
    const request = spec.buildRequests(slotConfigs, bidderRequest);
    const ortbRequest = request.data;
    const ortbResponse = {
      seatbid: [{
        bid: [{
          impid: ortbRequest.imp[0].id,
          price: 1.25,
          adm: 'This is an Ad',
          crid: 'Creative#123'
        }]
      }]
    };
    const bids = spec.interpretResponse({ body: ortbResponse }, request);
    expect(bids).to.have.lengthOf(1);
    // verify first bid
    const bid = bids[0];
    expect(bid.cpm).to.equal(1.25);
    expect(bid.ad).to.equal('This is an Ad');
    expect(bid.width).to.equal(300);
    expect(bid.height).to.equal(250);
    expect(bid.adId).to.equal('bid12345');
    expect(bid.creative_id).to.equal('Creative#123');
    expect(bid.creativeId).to.equal('Creative#123');
    expect(bid.netRevenue).to.equal(true);
    expect(bid.currency).to.equal('USD');
    expect(bid.ttl).to.equal(20);
  });

  it('Verify ttl/currency/adomain applied to bid', function () {
    const request = spec.buildRequests(slotConfigs, bidderRequest);
    const ortbRequest = request.data;
    const ortbResponse = {
      seatbid: [{
        bid: [{
          impid: ortbRequest.imp[0].id,
          price: 1.25,
          adm: 'This is an Ad#1',
          crid: 'Creative#123',
          exp: 50,
          adomain: ['advertiser.com']
        }, {
          impid: ortbRequest.imp[1].id,
          price: 1.25,
          adm: 'This is an Ad#2',
          crid: 'Creative#123'
        }]
      }],
      cur: 'GBP'
    };
    const bids = spec.interpretResponse({ body: ortbResponse }, request);
    expect(bids).to.have.lengthOf(2);
    // verify first bid
    const bid = bids[0];
    expect(bid.cpm).to.equal(1.25);
    expect(bid.ad).to.equal('This is an Ad#1');
    expect(bid.ttl).to.equal(50);
    expect(bid.currency).to.equal('GBP');
    expect(bid.meta).to.not.be.null;
    expect(bid.meta.advertiserDomains).to.eql(['advertiser.com']);
    const secondBid = bids[1];
    expect(secondBid.cpm).to.equal(1.25);
    expect(secondBid.ad).to.equal('This is an Ad#2');
    expect(secondBid.ttl).to.equal(20);
    expect(secondBid.currency).to.equal('GBP');
    expect(secondBid.meta).to.not.be.null;
    expect(secondBid.meta.advertiserDomains).to.eql([]);
  });

  it('Verify full passback', function () {
    const request = spec.buildRequests(slotConfigs, bidderRequest);
    const bids = spec.interpretResponse({ body: null }, request)
    expect(bids).to.have.lengthOf(0);
  });

  it('Verify Native request', function () {
    const request = spec.buildRequests(nativeSlotConfig, bidderRequest);
    expect(request.url).to.equal('https://bid.contextweb.com/header/ortb?src=prebid');
    expect(request.method).to.equal('POST');
    const ortbRequest = request.data;
    // native impression
    expect(ortbRequest.imp[0].tagid).to.equal('t10000');
    expect(ortbRequest.imp[0].banner).to.equal(null);
    const nativePart = ortbRequest.imp[0]['native'];
    expect(nativePart).to.not.equal(null);
    expect(nativePart.ver).to.equal('1.1');
    expect(nativePart.request).to.not.equal(null);
    // native request assets
    const nativeRequest = JSON.parse(ortbRequest.imp[0]['native'].request);
    expect(nativeRequest).to.not.equal(null);
    expect(nativeRequest.assets).to.have.lengthOf(3);
    // title asset
    expect(nativeRequest.assets[0].id).to.equal(1);
    expect(nativeRequest.assets[0].required).to.equal(1);
    expect(nativeRequest.assets[0].title).to.not.equal(null);
    expect(nativeRequest.assets[0].title.len).to.equal(200);
    // data asset
    expect(nativeRequest.assets[1].id).to.equal(2);
    expect(nativeRequest.assets[1].required).to.equal(0);
    expect(nativeRequest.assets[1].title).to.be.undefined;
    expect(nativeRequest.assets[1].data).to.not.equal(null);
    expect(nativeRequest.assets[1].data.type).to.equal(1);
    expect(nativeRequest.assets[1].data.len).to.equal(50);
    // image asset
    expect(nativeRequest.assets[2].id).to.equal(3);
    expect(nativeRequest.assets[2].required).to.equal(0);
    expect(nativeRequest.assets[2].title).to.be.undefined;
    expect(nativeRequest.assets[2].img).to.not.equal(null);
    expect(nativeRequest.assets[2].img.wmin).to.equal(100);
    expect(nativeRequest.assets[2].img.hmin).to.equal(150);
    expect(nativeRequest.assets[2].img.type).to.equal(3);
  });

  it('Verify Native response', function () {
    const request = spec.buildRequests(nativeSlotConfig, bidderRequest);
    expect(request.url).to.equal('https://bid.contextweb.com/header/ortb?src=prebid');
    expect(request.method).to.equal('POST');
    const ortbRequest = request.data;
    const nativeResponse = {
      'native': {
        assets: [
          { title: { text: 'Ad Title' } },
          { data: { type: 1, value: 'Sponsored By: Brand' } },
          { img: { type: 3, url: 'https://images.cdn.brand.com/123' } }
        ],
        link: { url: 'https://brand.clickme.com/' },
        imptrackers: ['https://imp1.trackme.com/', 'https://imp1.contextweb.com/']
      }
    };
    const ortbResponse = {
      seatbid: [{
        bid: [{
          impid: ortbRequest.imp[0].id,
          price: 1.25,
          adm: JSON.stringify(nativeResponse)
        }]
      }]
    };
    const bids = spec.interpretResponse({ body: ortbResponse }, request);
    // verify bid
    const bid = bids[0];
    expect(bid.cpm).to.equal(1.25);
    expect(bid.adId).to.equal('bid12345');
    expect(bid.ad).to.be.undefined;
    expect(bid.mediaType).to.equal('native');
    const nativeBid = bid['native'];
    expect(nativeBid).to.not.equal(null);
    expect(nativeBid.title).to.equal('Ad Title');
    expect(nativeBid.sponsoredBy).to.equal('Sponsored By: Brand');
    expect(nativeBid.image).to.equal('https://images.cdn.brand.com/123');
    expect(nativeBid.clickUrl).to.equal(encodeURIComponent('https://brand.clickme.com/'));
    expect(nativeBid.impressionTrackers).to.have.lengthOf(2);
    expect(nativeBid.impressionTrackers[0]).to.equal('https://imp1.trackme.com/');
    expect(nativeBid.impressionTrackers[1]).to.equal('https://imp1.contextweb.com/');
  });

  it('Verifies bidder code', function () {
    expect(spec.code).to.equal('pulsepoint');
  });

  it('Verifies bidder aliases', function () {
    expect(spec.aliases).to.have.lengthOf(2);
    expect(spec.aliases[0]).to.equal('pulseLite');
    expect(spec.aliases[1]).to.equal('pulsepointLite');
  });

  it('Verifies supported media types', function () {
    expect(spec.supportedMediaTypes).to.have.lengthOf(3);
    expect(spec.supportedMediaTypes[0]).to.equal('banner');
    expect(spec.supportedMediaTypes[1]).to.equal('native');
    expect(spec.supportedMediaTypes[2]).to.equal('video');
  });

  it('Verifies if bid request valid', function () {
    expect(spec.isBidRequestValid(slotConfigs[0])).to.equal(true);
    expect(spec.isBidRequestValid(slotConfigs[1])).to.equal(true);
    expect(spec.isBidRequestValid(nativeSlotConfig[0])).to.equal(true);
    expect(spec.isBidRequestValid({})).to.equal(false);
    expect(spec.isBidRequestValid({ params: {} })).to.equal(false);
    expect(spec.isBidRequestValid({ params: { ct: 123 } })).to.equal(false);
    expect(spec.isBidRequestValid({ params: { cp: 123 } })).to.equal(false);
    expect(spec.isBidRequestValid({ params: { ct: 123, cp: 234 } })).to.equal(true);
  });

  it('Verifies sync options', function () {
    expect(spec.getUserSyncs({})).to.be.undefined;
    expect(spec.getUserSyncs({ iframeEnabled: false })).to.be.undefined;
    const options = spec.getUserSyncs({ iframeEnabled: true });
    expect(options).to.not.be.undefined;
    expect(options).to.have.lengthOf(1);
    expect(options[0].type).to.equal('iframe');
    expect(options[0].url).to.equal('https://bh.contextweb.com/visitormatch');
  });

  it('Verifies image pixel sync', function () {
    const options = spec.getUserSyncs({ pixelEnabled: true });
    expect(options).to.not.be.undefined;
    expect(options).to.have.lengthOf(1);
    expect(options[0].type).to.equal('image');
    expect(options[0].url).to.equal('https://bh.contextweb.com/visitormatch/prebid');
  });

  it('Verify app requests', function () {
    const request = spec.buildRequests(appSlotConfig, bidderRequest);
    const ortbRequest = request.data;
    // site object
    expect(ortbRequest.site).to.equal(null);
    expect(ortbRequest.app).to.not.be.null;
    expect(ortbRequest.app.publisher).to.not.equal(null);
    expect(ortbRequest.app.publisher.id).to.equal('p10000');
    expect(ortbRequest.app.bundle).to.equal('com.pulsepoint.apps');
    expect(ortbRequest.app.storeurl).to.equal('https://pulsepoint.com/apps');
    expect(ortbRequest.app.domain).to.equal('pulsepoint.com');
  });

  it('Verify GDPR', function () {
    const bidderRequestGdpr = {
      gdprConsent: {
        gdprApplies: true,
        consentString: 'serialized_gpdr_data'
      }
    };
    const request = spec.buildRequests(slotConfigs, Object.assign({}, bidderRequest, bidderRequestGdpr));
    expect(request.url).to.equal('https://bid.contextweb.com/header/ortb?src=prebid');
    expect(request.method).to.equal('POST');
    const ortbRequest = request.data;
    // user object
    expect(ortbRequest.user).to.not.equal(null);
    expect(ortbRequest.user.ext).to.not.equal(null);
    expect(ortbRequest.user.ext.consent).to.equal('serialized_gpdr_data');
    // regs object
    expect(ortbRequest.regs).to.not.equal(null);
    expect(ortbRequest.regs.ext).to.not.equal(null);
    expect(ortbRequest.regs.ext.gdpr).to.equal(1);
  });

  it('Verify CCPA', function () {
    const bidderRequestUSPrivacy = {
      uspConsent: '1YYY'
    };
    const request = spec.buildRequests(slotConfigs, Object.assign({}, bidderRequest, bidderRequestUSPrivacy));
    expect(request.url).to.equal('https://bid.contextweb.com/header/ortb?src=prebid');
    expect(request.method).to.equal('POST');
    const ortbRequest = request.data;
    // regs object
    expect(ortbRequest.regs).to.not.equal(null);
    expect(ortbRequest.regs.ext).to.not.equal(null);
    expect(ortbRequest.regs.ext.us_privacy).to.equal('1YYY');
  });

  it('Verify Video request', function () {
    const request = spec.buildRequests(videoSlotConfig, bidderRequest);
    expect(request.url).to.equal('https://bid.contextweb.com/header/ortb?src=prebid');
    expect(request.method).to.equal('POST');
    const ortbRequest = request.data;
    expect(ortbRequest).to.not.equal(null);
    expect(ortbRequest.imp).to.have.lengthOf(1);
    expect(ortbRequest.imp[0].video).to.not.be.null;
    expect(ortbRequest.imp[0].native).to.be.null;
    expect(ortbRequest.imp[0].banner).to.be.null;
    expect(ortbRequest.imp[0].video.w).to.equal(400);
    expect(ortbRequest.imp[0].video.h).to.equal(300);
    expect(ortbRequest.imp[0].video.minduration).to.equal(5);
    expect(ortbRequest.imp[0].video.maxduration).to.equal(10);
    expect(ortbRequest.imp[0].video.startdelay).to.equal(0);
    expect(ortbRequest.imp[0].video.skip).to.equal(1);
    expect(ortbRequest.imp[0].video.minbitrate).to.equal(200);
    expect(ortbRequest.imp[0].video.protocols).to.eql([1, 2, 4]);
  });

  it('Verify Video response', function () {
    const request = spec.buildRequests(videoSlotConfig, bidderRequest);
    expect(request.url).to.equal('https://bid.contextweb.com/header/ortb?src=prebid');
    expect(request.method).to.equal('POST');
    const ortbRequest = request.data;
    const ortbResponse = {
      seatbid: [{
        bid: [{
          impid: ortbRequest.imp[0].id,
          price: 1.25,
          adm: '<VAST><Creative>https//pulsepoint.video.mp4</Creative></VAST>'
        }]
      }]
    };
    const bids = spec.interpretResponse({ body: ortbResponse }, request);
    const bid = bids[0];
    expect(bid.cpm).to.equal(1.25);
    expect(bid.adId).to.equal('bid12345');
    expect(bid.ad).to.be.undefined;
    expect(bid['native']).to.be.undefined;
    expect(bid.mediaType).to.equal('video');
    expect(bid.vastXml).to.equal(ortbResponse.seatbid[0].bid[0].adm);
  });

  it('Verify extra parameters', function () {
    let request = spec.buildRequests(additionalParamsConfig, bidderRequest);
    let ortbRequest = request.data;
    expect(ortbRequest).to.not.equal(null);
    expect(ortbRequest.imp).to.have.lengthOf(1);
    expect(ortbRequest.imp[0].ext).to.not.equal(null);
    expect(ortbRequest.imp[0].ext.prebid).to.not.equal(null);
    expect(ortbRequest.imp[0].ext.prebid).to.not.be.null;
    expect(ortbRequest.imp[0].ext.prebid.extra_key1).to.equal('extra_val1');
    expect(ortbRequest.imp[0].ext.prebid.extra_key2).to.equal(12345);
    expect(ortbRequest.imp[0].ext.prebid.extra_key3).to.not.be.null;
    expect(ortbRequest.imp[0].ext.prebid.extra_key3.key1).to.equal('val1');
    expect(ortbRequest.imp[0].ext.prebid.extra_key3.key2).to.equal(23456);
    expect(ortbRequest.imp[0].ext.prebid.extra_key4).to.eql([1, 2, 3]);
    expect(Object.keys(ortbRequest.imp[0].ext.prebid)).to.eql(['extra_key1', 'extra_key2', 'extra_key3', 'extra_key4']);
    // attempting with a configuration with no unknown params.
    request = spec.buildRequests(outstreamSlotConfig, bidderRequest);
    ortbRequest = request.data;
    expect(ortbRequest).to.not.equal(null);
    expect(ortbRequest.imp).to.have.lengthOf(1);
    expect(ortbRequest.imp[0].ext).to.equal(null);
  });

  it('Verify ortb parameters', function () {
    const request = spec.buildRequests(ortbParamsSlotConfig, bidderRequest);
    const ortbRequest = request.data;
    expect(ortbRequest).to.not.equal(null);
    expect(ortbRequest.bcat).to.eql(['IAB-1', 'IAB-20']);
    expect(ortbRequest.badv).to.eql(['cocacola.com', 'lays.com']);
    expect(ortbRequest.imp).to.have.lengthOf(2);
    expect(ortbRequest.imp[0].bidfloor).to.equal(1.5);
    expect(ortbRequest.imp[0].banner.battr).to.eql([1, 2, 3]);
    expect(ortbRequest.imp[0].ext).to.be.null;
    // slot 2
    expect(ortbRequest.imp[1].bidfloor).to.equal(2.5);
    expect(ortbRequest.imp[1].video.battr).to.eql([2, 3, 4]);
    expect(ortbRequest.imp[1].ext).to.be.null;
  });

  it('Verify schain parameters', function () {
    const request = spec.buildRequests(schainParamsSlotConfig, bidderRequest);
    const ortbRequest = request.data;
    expect(ortbRequest).to.not.equal(null);
    expect(ortbRequest.source).to.not.equal(null);
    expect(ortbRequest.source.ext).to.not.equal(null);
    expect(ortbRequest.source.ext.schain).to.not.equal(null);
    expect(ortbRequest.source.ext.schain.complete).to.equal(1);
    expect(ortbRequest.source.ext.schain.ver).to.equal('1.0');
    expect(ortbRequest.source.ext.schain.nodes).to.not.equal(null);
    expect(ortbRequest.source.ext.schain.nodes).to.lengthOf(1);
    expect(ortbRequest.source.ext.schain.nodes[0].asi).to.equal('exchange1.com');
    expect(ortbRequest.source.ext.schain.nodes[0].sid).to.equal('1234');
    expect(ortbRequest.source.ext.schain.nodes[0].hp).to.equal(1);
    expect(ortbRequest.source.ext.schain.nodes[0].rid).to.equal('bid-request-1');
    expect(ortbRequest.source.ext.schain.nodes[0].name).to.equal('publisher');
    expect(ortbRequest.source.ext.schain.nodes[0].domain).to.equal('publisher.com');
  });

  it('Verify outstream renderer', function () {
    const bidderRequestOutstream = Object.assign({}, bidderRequest, {bids: [outstreamSlotConfig[0]]});
    const request = spec.buildRequests(outstreamSlotConfig, bidderRequestOutstream);
    const ortbRequest = request.data;
    expect(ortbRequest).to.not.be.null;
    expect(ortbRequest.imp[0]).to.not.be.null;
    expect(ortbRequest.imp[0].video).to.not.be.null;
    const ortbResponse = {
      seatbid: [{
        bid: [{
          impid: ortbRequest.imp[0].id,
          price: 1.25,
          adm: '<VAST><Creative>https//pulsepoint.video.mp4</Creative></VAST>',
          ext: {
            outstream: {
              type: 'Inline',
              config: {
                text: 'ADVERTISEMENT',
                skipaftersec: 5
              },
              rendererUrl: 'https://tag.contextweb.com/hb-outstr-renderer.js'
            }
          }
        }]
      }]
    };
    const bids = spec.interpretResponse({ body: ortbResponse }, request);
    const bid = bids[0];
    expect(bid.cpm).to.equal(1.25);
    expect(bid.renderer).to.not.be.null;
    expect(bid.renderer.url).to.equal('https://tag.contextweb.com/hb-outstr-renderer.js');
    expect(bid.renderer.getConfig()).to.not.be.null;
    expect(bid.renderer.getConfig().defaultOptions).to.eql(ortbResponse.seatbid[0].bid[0].ext.outstream.config);
    expect(bid.renderer.getConfig().rendererOptions).to.eql(outstreamSlotConfig[0].renderer.options);
    expect(bid.renderer.getConfig().type).to.equal('Inline');
  });
  it('Verify common id parameters', function () {
    const bidRequests = deepClone(slotConfigs);
    bidRequests[0].userIdAsEids = [{
      source: 'pubcid.org',
      uids: [{
        id: 'userid_pubcid'
      }]
    }, {
      source: 'adserver.org',
      uids: [{
        id: 'userid_ttd',
        ext: {
          rtiPartner: 'TDID'
        }
      }]
    }
    ];
    const request = spec.buildRequests(bidRequests, bidderRequest);
    expect(request).to.be.not.null;
    const ortbRequest = request.data;
    expect(request.data).to.be.not.null;
    // user object
    expect(ortbRequest.user).to.not.be.undefined;
    expect(ortbRequest.user.ext).to.not.be.undefined;
    expect(ortbRequest.user.ext.eids).to.not.be.undefined;
    expect(ortbRequest.user.ext.eids).to.deep.equal(bidRequests[0].userIdAsEids);
  });
  it('Verify multiple adsizes', function () {
    const bidRequests = deepClone(slotConfigs);
    const request = spec.buildRequests(bidRequests, bidderRequest);
    expect(request).to.be.not.null;
    expect(request.data).to.be.not.null;
    const ortbRequest = request.data;
    expect(ortbRequest.imp).to.have.lengthOf(2);
    // first impression has multi sizes
    expect(ortbRequest.imp[0].banner).to.not.be.null;
    expect(ortbRequest.imp[0].banner.w).to.equal(300);
    expect(ortbRequest.imp[0].banner.h).to.equal(250);
    expect(ortbRequest.imp[0].banner.format).to.not.be.null;
    expect(ortbRequest.imp[0].banner.format).to.have.lengthOf(2);
    expect(ortbRequest.imp[0].banner.format[0].w).to.equal(728);
    expect(ortbRequest.imp[0].banner.format[0].h).to.equal(90);
    expect(ortbRequest.imp[0].banner.format[1].w).to.equal(160);
    expect(ortbRequest.imp[0].banner.format[1].h).to.equal(600);
    // slot 2
    expect(ortbRequest.imp[1].banner).to.not.be.null;
    expect(ortbRequest.imp[1].banner.w).to.equal(728);
    expect(ortbRequest.imp[1].banner.h).to.equal(90);
    expect(ortbRequest.imp[1].banner.format).to.not.be.null;
    expect(ortbRequest.imp[1].banner.format).to.have.lengthOf(1);
    expect(ortbRequest.imp[1].banner.format[0].w).to.equal(728);
    expect(ortbRequest.imp[1].banner.format[0].h).to.equal(90);
    // adsize on response
    const ortbResponse = {
      seatbid: [{
        bid: [{
          impid: ortbRequest.imp[0].id,
          price: 1.25,
          adm: 'This is an Ad',
          crid: 'Creative#123',
          w: 728,
          h: 90
        }]
      }]
    };
    const bids = spec.interpretResponse({ body: ortbResponse }, request);
    expect(bids).to.have.lengthOf(1);
    const bid = bids[0];
    expect(bid.width).to.equal(728);
    expect(bid.height).to.equal(90);
  });
  it('Verify multi-format response', function () {
    const bidRequests = deepClone(slotConfigs);
    bidRequests[0].mediaTypes['native'] = {
      title: {
        required: true
      },
      image: {
        required: true
      },
      sponsoredBy: {
        required: true
      }
    };
    bidRequests[1].params.video = {
      w: 400,
      h: 300,
      minduration: 5,
      maxduration: 10,
    };
    const request = spec.buildRequests(bidRequests, bidderRequest);
    expect(request).to.be.not.null;
    expect(request.data).to.be.not.null;
    const ortbRequest = request.data;
    expect(ortbRequest.imp).to.have.lengthOf(2);
    // adsize on response
    const ortbResponse = {
      seatbid: [{
        bid: [{
          impid: ortbRequest.imp[0].id,
          price: 1.25,
          adm: 'This is an Ad',
          crid: 'Creative#123',
          w: 728,
          h: 90
        }, {
          impid: ortbRequest.imp[1].id,
          price: 2.5,
          adm: '<vast url="http://ad.com/video"></vast>',
          crid: 'Creative#234',
          w: 728,
          h: 90
        }]
      }]
    };
    // request has both types - banner and native, response is parsed as banner.
    // for impression#2, response is parsed as video
    const bids = spec.interpretResponse({ body: ortbResponse }, request);
    expect(bids).to.have.lengthOf(2);
    const bid = bids[0];
    expect(bid.width).to.equal(728);
    expect(bid.height).to.equal(90);
    const secondBid = bids[1];
    expect(secondBid.vastXml).to.equal('<vast url="http://ad.com/video"></vast>');
  });
  it('Verify bid floor', function () {
    const bidRequests = deepClone(slotConfigs);
    bidRequests[0].params.bidfloor = 1.05;
    let request = spec.buildRequests(bidRequests, bidderRequest);
    let ortbRequest = request.data;
    expect(ortbRequest).to.not.equal(null);
    expect(ortbRequest.imp[0].bidfloor).to.equal(1.05);
    expect(ortbRequest.imp[1].bidfloor).to.be.undefined;
    let floorArg = null;
    // publisher uses the floor module
    bidRequests[0].getFloor = (arg) => {
      floorArg = arg;
      return { floor: 1.25 };
    };
    bidRequests[1].getFloor = () => {
      return { floor: 2.05 };
    };
    request = spec.buildRequests(bidRequests, bidderRequest);
    ortbRequest = request.data;
    expect(ortbRequest).to.not.equal(null);
    expect(ortbRequest.imp[0].bidfloor).to.equal(1.25);
    expect(ortbRequest.imp[1].bidfloor).to.equal(2.05);
    expect(floorArg).to.not.be.null;
    expect(floorArg.mediaType).to.equal('banner');
    expect(floorArg.currency).to.equal('USD');
    expect(floorArg.size).to.equal('*');
  });
  it('Verify Video params on mediaTypes.video', function () {
    const bidRequests = deepClone(videoSlotConfig);
    bidRequests[0].mediaTypes = {
      video: {
        w: 600,
        h: 400,
        minduration: 15,
        maxduration: 20,
        startdelay: 10,
        skip: 0,
      }
    };
    const request = spec.buildRequests(bidRequests, bidderRequest);
    const ortbRequest = request.data;
    expect(ortbRequest).to.not.equal(null);
    expect(ortbRequest.imp).to.have.lengthOf(1);
    expect(ortbRequest.imp[0].video).to.not.be.null;
    expect(ortbRequest.imp[0].native).to.be.null;
    expect(ortbRequest.imp[0].banner).to.be.null;
    expect(ortbRequest.imp[0].video.w).to.equal(600);
    expect(ortbRequest.imp[0].video.h).to.equal(400);
    expect(ortbRequest.imp[0].video.minduration).to.equal(15);
    expect(ortbRequest.imp[0].video.maxduration).to.equal(20);
    expect(ortbRequest.imp[0].video.startdelay).to.equal(10);
    expect(ortbRequest.imp[0].video.skip).to.equal(0);
    expect(ortbRequest.imp[0].video.minbitrate).to.equal(200);
    expect(ortbRequest.imp[0].video.protocols).to.eql([1, 2, 4]);
  });
  it('Verify user level first party data', function () {
    const bidderRequest = {
      refererInfo: {
        page: 'https://publisher.com/home',
        ref: 'https://referrer'
      },
      gdprConsent: {
        gdprApplies: true,
        consentString: 'serialized_gpdr_data'
      },
      ortb2: {
        user: {
          yob: 1985,
          gender: 'm',
          ext: {
            data: {
              registered: true,
              interests: ['cars']
            }
          }
        }
      }
    };
    let request = spec.buildRequests(slotConfigs, bidderRequest);
    let ortbRequest = request.data;
    expect(ortbRequest).to.not.equal(null);
    expect(ortbRequest.user).to.not.equal(null);
    expect(ortbRequest.user).to.deep.equal({
      yob: 1985,
      gender: 'm',
      ext: {
        data: {
          registered: true,
          interests: ['cars']
        },
        consent: 'serialized_gpdr_data'
      }
    });
  });
  it('Verify site level first party data', function () {
    const bidderRequest = {
      refererInfo: {
        page: 'https://publisher.com/home',
        ref: 'https://referrer'
      },
      ortb2: {
        site: {
          content: {
            data: [{
              name: 'www.iris.com',
              ext: {
                segtax: 500,
                cids: ['iris_c73g5jq96mwso4d8']
              }
            }]
          },
          page: 'http://pub.com/news',
          ref: 'http://google.com'
        }
      }
    };
    let request = spec.buildRequests(slotConfigs, bidderRequest);
    let ortbRequest = request.data;
    expect(ortbRequest).to.not.equal(null);
    expect(ortbRequest.site).to.not.equal(null);
    expect(ortbRequest.site).to.deep.equal({
      content: {
        data: [{
          name: 'www.iris.com',
          ext: {
            segtax: 500,
            cids: ['iris_c73g5jq96mwso4d8']
          }
        }]
      },
      page: 'https://publisher.com/home',
      ref: 'https://referrer',
      publisher: {
        id: 'p10000'
      }
    });
  });
  it('Verify impression/slot level first party data', function () {
    const bidderRequests = [{
      placementCode: '/DfpAccount1/slot1',
      mediaTypes: {
        banner: {
          sizes: [[1, 1]]
        }
      },
      bidId: 'bid12345',
      params: {
        cp: 'p10000',
        ct: 't10000',
        extra_key1: 'extra_val1',
        extra_key2: 12345
      },
      ortb2Imp: {
        ext: {
          data: {
            pbadslot: 'homepage-top-rect',
            adUnitSpecificAttribute: '123'
          }
        }
      }
    }];
    let request = spec.buildRequests(bidderRequests, bidderRequest);
    let ortbRequest = request.data;
    expect(ortbRequest).to.not.equal(null);
    expect(ortbRequest.imp).to.not.equal(null);
    expect(ortbRequest.imp).to.have.lengthOf(1);
    expect(ortbRequest.imp[0].ext).to.not.equal(null);
    expect(ortbRequest.imp[0].ext).to.deep.equal({
      prebid: {
        extra_key1: 'extra_val1',
        extra_key2: 12345
      },
      data: {
        pbadslot: 'homepage-top-rect',
        adUnitSpecificAttribute: '123'
      }
    });
  });
});
