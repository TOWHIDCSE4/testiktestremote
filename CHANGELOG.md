# Changelog

## [1.1.0](https://github.com/ieko-media/apms/compare/v1.0.0...v1.1.0) (2023-09-25)

### Features

- Added additional info data for Jobs ([b4c82cf](https://github.com/ieko-media/apms/commit/b4c82cf54be5dadf204ccf57dd01baf941ba586c))
- added api for get machine by location and machineclass filter ([7240b5a](https://github.com/ieko-media/apms/commit/7240b5a30e94e4d3200165efc3b9ecad33eb1d80))
- added custom hook for get machines by machineclass and location ([393ae9d](https://github.com/ieko-media/apms/commit/393ae9d2a4c967c9e8f0a409307500b7fde79c86))
- added filter for machineClass in timer creation modal but not work due to hook ([0542425](https://github.com/ieko-media/apms/commit/05424258b5b6b6b38a540f2000c36fd762265f04))
- added filter on the machine in timer creation which has already assigned timer ([06e6528](https://github.com/ieko-media/apms/commit/06e65287b9fd1f81e502000237c091e9addcbbeb))
- added machineClass and logic in timercreation modal UX ([49ded50](https://github.com/ieko-media/apms/commit/49ded5053cd1a73dfedb7fbd98703f6ce6d9dfe9))
- added route for getmachinebymachineclass ([c5fd542](https://github.com/ieko-media/apms/commit/c5fd542bf14ef9dfbd8224bc7e2be7fb2ceb2216))

### Bug Fixes

- Added 0 to default globalcycle ([1b6e5d0](https://github.com/ieko-media/apms/commit/1b6e5d0e907bf337e223ba2f9e90bb740110e1ff))
- Added fix for Jamiel comments sept 12 ([be65664](https://github.com/ieko-media/apms/commit/be65664185ec02f679be7644f0a927ae82bfbf3d))
- Added overflow for time tracker tables ([3bb400f](https://github.com/ieko-media/apms/commit/3bb400f58f2e99ba698e723407f57da4bfee4de5))
- Added redirect on login page if logged in ([3bbd27f](https://github.com/ieko-media/apms/commit/3bbd27ffd3544c2434a17837168a407c754a8855))
- Added status condition for all TimerLogs ([9f66000](https://github.com/ieko-media/apms/commit/9f66000fc3a458ab991ab3997820b3bfeb5f4125))
- Change unauthorize message ([6a2b11c](https://github.com/ieko-media/apms/commit/6a2b11c80f09b6bc85c2d0372b0d378ada73e87e))
- Default value of time tracker gain and loss ([4192e45](https://github.com/ieko-media/apms/commit/4192e45eeba593f3316651b777c4be68a6544d12))
- End cycle timer when controller prod ended ([e693b2e](https://github.com/ieko-media/apms/commit/e693b2e5782fffb7f365b752aa05e941d62a9f66))
- Fix update of timer job ([e08a497](https://github.com/ieko-media/apms/commit/e08a497f0c04419994b88df66a650581a6e1391b))
- fixed the location and factory issue in profile and profile home page ([00f3ba8](https://github.com/ieko-media/apms/commit/00f3ba890312fd1541345b8cbe2e65e6b01493f9))
- General bugs and problems ([cc7590e](https://github.com/ieko-media/apms/commit/cc7590e51fef453db6ae3933b08d9c49d1a3d7ee))
- Jamiel comments sept 15 ([627ced8](https://github.com/ieko-media/apms/commit/627ced8f4e4d0295dbc5cf6f5111fb4e12013e0c))
- Jamiel comments sept 18 ([d56b487](https://github.com/ieko-media/apms/commit/d56b4873b6bd4bdf7a8a5c74201e290a39da947c))
- Jamiels comments sept 11 2023 ([e88de3b](https://github.com/ieko-media/apms/commit/e88de3b84ee9aa5703093bec212b7169eda4f46f))
- made personnel users can not see edit part button in timers page-&gt; timers details modal ([319da59](https://github.com/ieko-media/apms/commit/319da59f9eca95aa3736ce538f06e227957b111b))
- Make sure logs will go to stock when target reached ([7ddda97](https://github.com/ieko-media/apms/commit/7ddda97bafee131977a3cd74be1a0557e63c1625))
- night shift in timer creation modal grayed out ([6724616](https://github.com/ieko-media/apms/commit/6724616b171f2596ad049bffbc9578f9a15854e2))
- Pagination team members ([791b23a](https://github.com/ieko-media/apms/commit/791b23a9f58cb131ca786877a046e3a1a42ad277))
- removed custom fonts and exchanged with exo_2 ([e0474c8](https://github.com/ieko-media/apms/commit/e0474c83f95d9480c4fced3672a2fc332630a402))
- removed fonts in tailwind config ([64a13d1](https://github.com/ieko-media/apms/commit/64a13d105e23aad0cf6a998545ad85d4342df780))
- Replace part words on machine pages ([2838f9c](https://github.com/ieko-media/apms/commit/2838f9c01eeb7d4919bbe1c9fd3f2d520a481184))
- Show all rows on pagination results ([3806c1c](https://github.com/ieko-media/apms/commit/3806c1ce83cdfa7df4594ee36cacb94a6a89ff6f))
- style fix of creation modals for part/machine/timer ([077bd31](https://github.com/ieko-media/apms/commit/077bd31e29003b36211aa7c98cad3de600ae5c1d))
- style fixed for timer page and content in system check page ([4952e96](https://github.com/ieko-media/apms/commit/4952e96c556e69461fd9378e7db71e8d615f773e))
- Super admin access to timers ([99391a9](https://github.com/ieko-media/apms/commit/99391a961fce59a5e59018badd7f592484354b02))
- Time tracker data get all not by page ([4c63144](https://github.com/ieko-media/apms/commit/4c631442c779b90919bc5cd9c2b0afa323be1eec))
- Timer data reset only on midnight ([258f79c](https://github.com/ieko-media/apms/commit/258f79cd32db3478d9caf7077320d76915c3bd17))
- UI for factory and location for user profile ([1f91b78](https://github.com/ieko-media/apms/commit/1f91b786b70c5b34b8df05271f36a08de19673de))
- update Part and selected part on timer card fixed ([0d7f636](https://github.com/ieko-media/apms/commit/0d7f63616efcf48638c1338d73bf056ae37fae53))
- Update timer part when changing location ([dfe32ab](https://github.com/ieko-media/apms/commit/dfe32ab5a77570ff8bed43fa21e1f84a8b3ab0f7))
- User id for adding new jobs ([bd6b5f9](https://github.com/ieko-media/apms/commit/bd6b5f97396be7f834f892a0243b59174cbdf953))

## 1.0.0 (2023-09-10)

### Features

- accept and delete user function ([72c9bdc](https://github.com/ieko-media/apms/commit/72c9bdc9b3f73b422a4207e4165530b07cc1d791))
- accounts page table pagination ([0fa943e](https://github.com/ieko-media/apms/commit/0fa943e789a47c68d5748c289fd6376869e4032d))
- accounts table ([3fd0829](https://github.com/ieko-media/apms/commit/3fd082996179ce65f116484331efe593f34c4eca))
- add skeleton for part ([b76b21e](https://github.com/ieko-media/apms/commit/b76b21ec6e353be6557cc3bb71437d879e77f44b))
- Added Edit Part on Timer Details Modal ([9feb6f7](https://github.com/ieko-media/apms/commit/9feb6f743b104d60138291988386f242af6502ee))
- Added list page of part ([171bbdf](https://github.com/ieko-media/apms/commit/171bbdfaef16740607f4807f1136c8bfd9befde0))
- Added new value for logs name globalCycle ([41e9709](https://github.com/ieko-media/apms/commit/41e970969f2838f2f3bf2ae0aa1e04779f0d91ff))
- Added not assigned category for product lists ([977bc71](https://github.com/ieko-media/apms/commit/977bc714f2c0a5e655098ef20d5f86e164bb4cdd))
- Added overall values for machine class id ([a0e5a17](https://github.com/ieko-media/apms/commit/a0e5a177d51c7f3291c2fa0658fbcebf8fd30f8b))
- Added routes for getting parts by machine class and created hooks for that ([78eef37](https://github.com/ieko-media/apms/commit/78eef37867a48ea240acd5798ad5ec24681865bb))
- Added searchable for operator in controller ([63f792b](https://github.com/ieko-media/apms/commit/63f792bbf88b76f3008a8c10c4b3ff7631dc2b11))
- Added timer part input searchable ([7a1f980](https://github.com/ieko-media/apms/commit/7a1f9802a6fffb7a654d644fa9acb8b5e182087b))
- Added tofixed 6 for totals ([78818be](https://github.com/ieko-media/apms/commit/78818be6a4c0b2b352aad954838ef4947b368ea0))
- Added value for product in inventory ([7ad9b64](https://github.com/ieko-media/apms/commit/7ad9b6485b74c45900051bc82394a75d7ddaa1b1))
- **api:** Checked if user is approve when loggedin ([76d3580](https://github.com/ieko-media/apms/commit/76d358062b6909ab5b290ce7d9e0a4254927da7e))
- **api:** Created api routes for controller timer ([459357d](https://github.com/ieko-media/apms/commit/459357d5d53206179678882d310bb153b588d2a9))
- **api:** Created cycle-timer routes ([3f2d13e](https://github.com/ieko-media/apms/commit/3f2d13e3c07f204be9870fe64c7513dd5c264d43))
- **api:** Created endpoint for job count per status and location ([2f0692e](https://github.com/ieko-media/apms/commit/2f0692e7a606adb45a51a57699963af205f2e417))
- **api:** Created factories routes ([2030f7b](https://github.com/ieko-media/apms/commit/2030f7b895fe89858dce61ed82b04bb6b39655c5))
- **api:** Created jobs routes in api ([a26bda9](https://github.com/ieko-media/apms/commit/a26bda97449c1e294924767756459975764fe7a3))
- **api:** Created locations routes ([a0acaf8](https://github.com/ieko-media/apms/commit/a0acaf8db393c25864885dd0823f51b774c77aeb))
- **api:** Created login and logout authentication with jwt and redis ([25e5aee](https://github.com/ieko-media/apms/commit/25e5aeebdf3521004f3a104aaa02d5aa6148eac6))
- **api:** Created machine-classes routes ([61328ae](https://github.com/ieko-media/apms/commit/61328aec073cd1d44b6adf386e4869667a79860d))
- **api:** Created machines routes ([cb30958](https://github.com/ieko-media/apms/commit/cb3095883b996bdee7093dd21f51d05f36ab8314))
- **api:** Created middleware isRoleAllowed ([7b0be16](https://github.com/ieko-media/apms/commit/7b0be16f05bb3ce24bcd9345646c7d3aa27c0176))
- **api:** Created middleware isRoleAllowed ([cf697e9](https://github.com/ieko-media/apms/commit/cf697e9c272c63aac4c9e9be0d181361824ee3f6))
- **api:** Created parts api routes ([aa3ea6f](https://github.com/ieko-media/apms/commit/aa3ea6f3b826e7ff083f7067e9d1101dfe3b8430))
- **api:** Created schema models and initial routes per endpoints in backend ([6f6ed33](https://github.com/ieko-media/apms/commit/6f6ed333d7232d79fba42b4e4a3c7ae5bd8b87fb))
- **api:** Created timer-logs route in api ([b7d04b8](https://github.com/ieko-media/apms/commit/b7d04b889d91cb10237f76ad8130965dda6f8706))
- **api:** Created timer-readings route ([f9737db](https://github.com/ieko-media/apms/commit/f9737dbfa99e190812da9c3d832ec3ba3eb84cb6))
- **api:** Created timers routes ([3ac3cde](https://github.com/ieko-media/apms/commit/3ac3cde6f931d06f30ef33ffb37b26b53075b196))
- **api:** Created users routes ([45b5b41](https://github.com/ieko-media/apms/commit/45b5b4144c2c07d421e7da8d4117b1f8169ac3ac))
- Checking email if valid in registration of user ([3ab9757](https://github.com/ieko-media/apms/commit/3ab9757b379ecc101f66b97cf93b23979e48fb1f))
- Combined Radial Press and Variants and fix sorting timers ([84aa819](https://github.com/ieko-media/apms/commit/84aa819041d6d4c47c4bdbf26243e4be792a7770))
- Convert operator input to combo box ([bf0b519](https://github.com/ieko-media/apms/commit/bf0b5191fdd8f75586322ccd1d1dc6146f1e164e))
- **create-turbo:** apply official-starter transform ([0345814](https://github.com/ieko-media/apms/commit/034581410544109d06ffcb9e5d3e594bd727c177))
- **create-turbo:** apply package-manager transform ([4c9a346](https://github.com/ieko-media/apms/commit/4c9a3464d61a2ad24abc14daebe82603e1cb1989))
- **create-turbo:** create basic ([7c42835](https://github.com/ieko-media/apms/commit/7c428350c893587e3cdec440a623565b32a1874a))
- Make stop value container 2 column and make log row red ([bd4ecf5](https://github.com/ieko-media/apms/commit/bd4ecf5bac56100d190f755b80db8429344f0421))
- **packages:** Added reusable zod schema ([45be9bf](https://github.com/ieko-media/apms/commit/45be9bf856b77821b1af618a85d71aabbe5ee16a))
- Row highlighting for single time tracker ([f96d7e1](https://github.com/ieko-media/apms/commit/f96d7e13a681611bfea9809eb91f6ef6ebc2b5ad))
- **web:** Active selector of sidebar ([ce93525](https://github.com/ieko-media/apms/commit/ce9352525a9c6fa0d69491054220c0e94c9a24dc))
- **web:** Added accounts page UI ([dce478a](https://github.com/ieko-media/apms/commit/dce478ae239684c69047a7dcc2641bd700e8798f))
- **web:** Added all pages and its headers ([d400120](https://github.com/ieko-media/apms/commit/d400120c63680cce048e1398c21f8b2e05efe056))
- **web:** Added basic information and password edit form update function ([61d8efc](https://github.com/ieko-media/apms/commit/61d8efcbdde5f7066dee55da14673257d41010ba))
- **web:** Added custom hook for adding Timer ([18b6ddc](https://github.com/ieko-media/apms/commit/18b6ddce0a8c4d4524bd504f99c76309756bcaf8))
- **web:** Added custom hook for updating timeLogs ([d660d7b](https://github.com/ieko-media/apms/commit/d660d7b02168f96c34b0e29f2fa93a7682cf8c4a))
- **web:** Added custom hooks for getting timers by location or factories ([b668ac1](https://github.com/ieko-media/apms/commit/b668ac11a80ddccca95715856c6aa04fdb45884b))
- **web:** Added date and locale time render ([b35ac55](https://github.com/ieko-media/apms/commit/b35ac55e84b3ce23ca19441e6702aecf7d1d2fbe))
- **web:** Added delete part and machine ([f129878](https://github.com/ieko-media/apms/commit/f1298787436c12c3a987d7591a2e6bca00e2755a))
- **web:** Added delete timer log hook ([28295cd](https://github.com/ieko-media/apms/commit/28295cd8ae880f97336f4e998b2878480780dde7))
- **web:** Added functionality for Edit Jobs, Delete jobs and pagination in jobs ([08b9142](https://github.com/ieko-media/apms/commit/08b9142f027e4e3cf8753ce45f3cbf114949fd18))
- **web:** Added get timer log hook ([3a8fccf](https://github.com/ieko-media/apms/commit/3a8fccf11641add2d5e99c8c1e1aa650d1dd8444))
- **web:** Added hook for adding timerLogs ([db6f470](https://github.com/ieko-media/apms/commit/db6f470bf2741520356b1a22565987a41e237343))
- **web:** Added Hook for get all timer logs ([cffc2e3](https://github.com/ieko-media/apms/commit/cffc2e33c93e695e3e50e6bac84294abc9eceeaf))
- **web:** Added hook for get single location ([d6447cf](https://github.com/ieko-media/apms/commit/d6447cfbe078536542613f0b1c09d32dbdd9a286))
- **web:** Added hook for get timer details ([2213b0c](https://github.com/ieko-media/apms/commit/2213b0c286aab322f73353cf4803cd848aecfb47))
- **web:** Added hook for removing timer ([1a78016](https://github.com/ieko-media/apms/commit/1a78016b073592a8b4159c3bcc5ec4627394983c))
- **web:** Added login hook ([b9f3aca](https://github.com/ieko-media/apms/commit/b9f3aca979c43784c83e7c855ff891b05f0dd731))
- **web:** Added logo and slider images ([00f1c4d](https://github.com/ieko-media/apms/commit/00f1c4d4866dcb9657c5446482e77881d431a387))
- **web:** Added machine class filter for timers ([e357bdd](https://github.com/ieko-media/apms/commit/e357bddaec2098103419395aca11ab856e809527))
- **web:** Added new part add functionality ([d46f31f](https://github.com/ieko-media/apms/commit/d46f31f6903d61dde149bc71bcd04f773a3e5309))
- **web:** Added new timer functionality ([192f34c](https://github.com/ieko-media/apms/commit/192f34c4bfbfc379835d7aab40ecbafa7c7fb966))
- **web:** Added product list page ([0e1b507](https://github.com/ieko-media/apms/commit/0e1b507a5ac7d3ec7cb4ea05af2924d1a46d42ef))
- **web:** Added product list states and modals ([f33d033](https://github.com/ieko-media/apms/commit/f33d033114a1dbf4efb1ec6aa2fc2e2db4e35243))
- **web:** Added profile image and signal bars for priority ([ff712ad](https://github.com/ieko-media/apms/commit/ff712adb007e872eb9730f059aa21642df144b15))
- **web:** Added registration hook ([ddb1853](https://github.com/ieko-media/apms/commit/ddb18536212c0d523432dc96a6bbbcad46d70661))
- **web:** Added timer controller UI ([9bcf2f6](https://github.com/ieko-media/apms/commit/9bcf2f60acea0f31b727025728cc0ee3b8f39e42))
- **web:** Added timer modals and full screen function on timer tracker ([8059aac](https://github.com/ieko-media/apms/commit/8059aac47b96f62ac0c90a0e75612a34259cd602))
- **web:** Added timer page UI ([a27072b](https://github.com/ieko-media/apms/commit/a27072b3d05fafb56f879c4ae5b75c8968953f72))
- **web:** Added UI table for production tracker ([8787b10](https://github.com/ieko-media/apms/commit/8787b10268a1bfad8fb9f2e00e5b76092c48adf9))
- **web:** Added UI table for production tracker ([8cc85f6](https://github.com/ieko-media/apms/commit/8cc85f6184303bdf45b0b943ccc57a82c8895139))
- **web:** Added view report window ([6e7c52f](https://github.com/ieko-media/apms/commit/6e7c52ffc99b3931f431064513b4c631581049d3))
- **web:** Change mockup data to real data for user name and ui improvements ([234420e](https://github.com/ieko-media/apms/commit/234420eb2dc00e1c2f5d20a3886ba6643930881b))
- **web:** Create QueryWrapper to use custom hooks in login and register page ([bad90e3](https://github.com/ieko-media/apms/commit/bad90e31c2ff1cb3d4975d2abff915c95708e244))
- **web:** Created and Implemented custom hooks for count per status ([71a4d7e](https://github.com/ieko-media/apms/commit/71a4d7e258cd8953e69484fc4babba7303f494d8))
- **web:** Login function created no logout yet ([be9ad14](https://github.com/ieko-media/apms/commit/be9ad141cc9698e1525878cdca14217449e17dbc))
- **web:** Machine creation, lists, filtering and pagination ([d6e54c9](https://github.com/ieko-media/apms/commit/d6e54c952e39a48e5a677a4a9f908777a9d15264))
- **web:** Main navigation and sidebar navigation added ([1902e6d](https://github.com/ieko-media/apms/commit/1902e6df0407bfebbd8096a57296ff26e301d13c))
- **web:** Profile page added ([7a94461](https://github.com/ieko-media/apms/commit/7a94461e64b408563fcea873c81d25c7f8b58802))
- **web:** Put register page to another page ([19d5b4a](https://github.com/ieko-media/apms/commit/19d5b4a023228e274a822766a829f7de8aa78b65))
- **web:** Re-styled product list details (not responsive yet) and delete modal ([99f2148](https://github.com/ieko-media/apms/commit/99f21489dfba43264fde575d665c7d0985e0ccd4))
- **web:** Registration added ([b593eb4](https://github.com/ieko-media/apms/commit/b593eb4231ab271d139ab41ee54522b28dbc7795))
- **web:** Show part location count ([f29cb40](https://github.com/ieko-media/apms/commit/f29cb40f98f842bdb9a7102cf80bcc770161b06e))
- **web:** Sign-in and Sign-up UI added ([f1a0da7](https://github.com/ieko-media/apms/commit/f1a0da7adc69ce17aceb710b7d9ea5894b3d4873))
- **web:** Slider and logo added ([7ed76d1](https://github.com/ieko-media/apms/commit/7ed76d16d8bcbe15b75ca14ded175c155a83ec94))
- **web:** Upload new image on update part and machine ([9598ab8](https://github.com/ieko-media/apms/commit/9598ab89e7c0b18b25bcb67f168695d583d0e2b0))
- WIP accounts table ([3dce1ff](https://github.com/ieko-media/apms/commit/3dce1ff3c39b411ed392968425ff10a57eef57d8))
- WIP filter timers per location ([66514e6](https://github.com/ieko-media/apms/commit/66514e646f43986fab3c7d8d30d8338bb5b37c3f))
- WIP part update function ([b93b220](https://github.com/ieko-media/apms/commit/b93b22046cefb8560e4b8ce82e33f496613ae119))
- WIP parts pagination ([3de56c8](https://github.com/ieko-media/apms/commit/3de56c8fba833a77b071ee5fa4892b816b3aba19))
- WIP timer page ([6ac8c72](https://github.com/ieko-media/apms/commit/6ac8c72306e4a6df6f284d15b9ac1f987126c5e1))
- **zod:** Created all Zod schema that can be use in front and backend validation ([0d99785](https://github.com/ieko-media/apms/commit/0d99785f383bdb2c7acfb11e5b62bdd0e8a4e419))

### Bug Fixes

- added not authorized content to product list page for corporate and personal role users ([fed0f04](https://github.com/ieko-media/apms/commit/fed0f04db8076d578f683ca45827ddbcdafd324a))
- added not authorized content to production tracker page for corporate and personal role users ([f423462](https://github.com/ieko-media/apms/commit/f4234629b204a23a8eecec409cf83d5b2408fdda))
- added not authorized content to timer page for corporate and personal role users ([7668aba](https://github.com/ieko-media/apms/commit/7668aba7f1c5c2f29f2c0f6238b30f0ed18cc3b3))
- Added time on time tracker date ([ab82255](https://github.com/ieko-media/apms/commit/ab82255ce11193f71a034a2a1dd955b5cfa693d6))
- **api:** Setup environment variables ([05435f7](https://github.com/ieko-media/apms/commit/05435f777e422c548bb3100be84c18c851194992))
- **api:** User will not be allowed to re use email on registration ([f702690](https://github.com/ieko-media/apms/commit/f7026902d34f4c60c0d7813865121a5056e2a5d6))
- changed order of city tab panel by resorting by createdAt ([a36af73](https://github.com/ieko-media/apms/commit/a36af73c1c62baee078b1db16a2aaf82783d28e3))
- fixed spelling of the content of not authorized in product list page to small letter ([98e14a2](https://github.com/ieko-media/apms/commit/98e14a2185cba89efb37a1182724311b1fb0fb6a))
- fixed Timer Page Header with authroization- ADMIN_ROLES. NEW TIMER ADD AUTH. PERSONAL & PRODUCTION CITY BUTTON AUTO ASSIGN AND DISABLE ([fc7b8cd](https://github.com/ieko-media/apms/commit/fc7b8cdd8ae77eb11b1db1fb8cb26938b52f886b))
- Login for users ([8e9214a](https://github.com/ieko-media/apms/commit/8e9214aed6c8e9ff5b903be74ac54cdb3a75c45e))
- Make job user logo the creator ([c1478a9](https://github.com/ieko-media/apms/commit/c1478a963774f0d9f95b7cf2f457e7f65a7e261c))
- Remove 3 seconds delay on stopping cycle ([2bb2791](https://github.com/ieko-media/apms/commit/2bb27910d3f28a24e6a1eb9ccb95cc71ecaee2b0))
- Remove redis quit ([9629c67](https://github.com/ieko-media/apms/commit/9629c67d443d6edb3bbee9812cc8f0fe8b3d5790))
- Reset page every location change product lists ([f596869](https://github.com/ieko-media/apms/commit/f5968690398a11310b3b9bad85d1cf164fdebef6))
- Update tofixed to 3 ([d815241](https://github.com/ieko-media/apms/commit/d8152416289deedb833c4ce4d0b5adbd742e0340))
- User Profile and bugs fixing from Jamiel ([3dbf853](https://github.com/ieko-media/apms/commit/3dbf853a69943b5c939e9f8ee4bfd54c46fdcee5))
- **web:** Conflict resolved (class styling conflict) ([bfbbb29](https://github.com/ieko-media/apms/commit/bfbbb2928a354cdf0f753d13078fe5807c2955bf))
- **web:** Conflicts resolved (class styling resolved) ([90bdd31](https://github.com/ieko-media/apms/commit/90bdd311ce977a533a228a1445c50d160f18ba76))
- **web:** Disabled on scroll when page refreshed/loaded ([544e877](https://github.com/ieko-media/apms/commit/544e877d24e037d72951423362d6b8216c63e383))
- **web:** Fixed delete modal of job ([3b47fb4](https://github.com/ieko-media/apms/commit/3b47fb4d60bf96a1b0f7f31ce5503821c3930ca3))
- **web:** Fixed overlapping elements ([ccc4ebb](https://github.com/ieko-media/apms/commit/ccc4ebbac850c85dbf1f248c7de4032794cfa9b6))
- **web:** Fixed some layouts and end production confirmation modal ([a8685a0](https://github.com/ieko-media/apms/commit/a8685a0eef0e991b69311d503488ea151ab99841))
- **web:** Fixed timer width ([b2d5d4c](https://github.com/ieko-media/apms/commit/b2d5d4cc255c499e2416893db2f4fa2a0b71b0ed))
- **web:** Full screen timer tracker modified ([d441905](https://github.com/ieko-media/apms/commit/d441905f4f72173355d7d0ac8b6bab1991a46e59))
- **web:** Make sure selected page on sidebar is accurate ([465909b](https://github.com/ieko-media/apms/commit/465909bbfd575a70163df1cc4dd023f0bf7cd8ab))
- **web:** Modified controller layout ([fdb0473](https://github.com/ieko-media/apms/commit/fdb04732d498b85eb9d233138ab29c6eb82327af))
