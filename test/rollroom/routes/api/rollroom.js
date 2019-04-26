//Author: Yang dragon2tech@163.com

var util = require('util');
var formidable = require('formidable');
var Redis = require('ioredis');

var config = require('../../config');
var sequelize = require('../../database/sequelize');
var utils = require('../../utils/utils');
var sha256 = utils.sha256;

const User = sequelize.models.User;
const RollRoom = sequelize.models.RollRoom;
const Prizes = sequelize.models.Prizes;
const Participators = sequelize.models.Participators;
const Win = sequelize.models.Win;
const Message = sequelize.models.Message;

var api_roll = {
	'post|/login': function(req, res, next) {
		var data = req.body;
		console.log(data);

		var code = data.code;
		var nickname = data.nickname;
		var avatarUrl = data.avatarUrl;
		var now = new Date().getTime();

		utils.wx_code_to_userid(code, function(id) {
			var openid;
			if (id == null) {
				res.end(JSON.stringify({
					msg: 'code been used'
				}))
			} else {
				openid = sha256(id);
				var new_session_code = utils.createSessionCode();
				User.findOne({
					where: {
						wechat_id: openid
					}
				}).then(function(user) {
					if (typeof user == 'undefined' || user == null) {
						console.log('post|/login---- new user')
						User.create({
							wechat_id: openid,
							nickname: nickname,
							avatar_url: avatarUrl,
							last_login_time: now,
							session_code: new_session_code
						}).then(function(newuser) {
							var response = {
								msg: 'failed',
								session_key: null
							};
							if(newuser) {
								console.log('post|/login---- created user ' + newuser.nickname);
								response.msg = 'success';
								response.session_key = newuser.session_code;
								res.end(JSON.stringify(response));
							} else {
								console.log('post|/login----  failed while creating user ' + nickname);
								res.end(JSON.stringify(response));
							}
						});
					} else {
						user.avatar_url = avatarUrl;
						user.last_login_time = now;
						user.session_code = new_session_code;
						user.save().then(function(updated_user) {
							var response = {
								msg: 'failed',
								session_key: null
							};
							if(updated_user) {
								console.log('post|/login---- updated user ' + updated_user.nickname);
								response.msg = 'success';
								response.session_key = updated_user.session_code;
								res.end(JSON.stringify(response));
							} else {
								console.log('post|/login----  failed while updating user ' + nickname);
								res.end(JSON.stringify(response));
							}
						});
					}
				});
			}
		});
	},

	'post|/createRoll': function(req, res, next) {
		var data = req.body;
		console.log(data);

		var session_key = data.session_key;
		var wechat_id;
		var title = data.title.trim();
		var create_time = new Date().getTime();
		var have_passwd = Number(data.have_passwd);
		var passwd;
		var show_on_list = 1;
		var roll_type = Number(data.roll_type);
		var time_limit;
		var people_limit;
		var selected_mode = Number(data.selected_mode);
		var roll_desc = data.roll_desc.trim();
		var status = 'open';
		var email = data.email.trim();
		var phone = data.phone.trim();
		var creator_avatar;
		var prize_imgs = data.prize_imgs;
		if (have_passwd == 1) {
			passwd = data.passwd;
		}
		if(roll_type == 1) {
			time_limit = Number(data.time_limit);
		} else if (roll_type == 2) {
			people_limit = Number(data.people_limit);
		}

		User.findOne({
			where: {
				session_code: session_key
			}
		}).then(function(user) {
			var response = {
				msg: 'failed',
				roll: {
					roll_id: null,
					title: null,
					password: null,
					create_time: null,
					qrcode_url: null
				}
			};
			if (user == null || typeof user == 'undefined') {
				response.msg = 'session_key expried';
				res.end(JSON.stringify(response));
			} else {
				wechat_id = user.wechat_id;
				creator_avatar = user.avatar_url;
				RollRoom.create({
					title: title,
					create_time: create_time,
					have_passwd: have_passwd,
					passwd: passwd,
					show_on_list: show_on_list,
					roll_type: roll_type,
					time_limit: time_limit,
					people_limit: people_limit,
					selected_mode: selected_mode,
					roll_desc: roll_desc,
					status: status,
					email: email,
					phone: phone,
					creator_avatar: creator_avatar,
					wechat_id: wechat_id,
					qrcode_url: 'https://' + config.server_url + '/images/rolls_qrcode/error.png'
				}).then(function(rollroom) {
					if (rollroom) {
						utils.generateQRCodeImage(String(config.server_url + '/roll/' + rollroom.roll_id), function(err, qrcode_path) {
							rollroom.qrcode_url = qrcode_path;
							rollroom.save().then(function(new_roll) {
								var prizes = [];
								for (var i = 0; i < prize_imgs.length; i++) {
									var temp = {
										roll_id: rollroom.roll_id,
										img_url: prize_imgs[i]
									};
									prizes.push(temp);
								}
								Prizes.bulkCreate(prizes).then(function(new_prizes) {
									if (new_prizes.length > 0) {
										response.msg = 'success';
										response.roll.roll_id = rollroom.roll_id;
										response.roll.title = rollroom.title;
										response.roll.password = rollroom.passwd;
										response.roll.create_time = rollroom.create_time;
										response.roll.qrcode_url = rollroom.qrcode_url;
										console.log(response);
										res.end(JSON.stringify(response));
									} else {
										res.end(JSON.stringify(response));
									}
								})
							})
						})
						
					} else {
						res.end(JSON.stringify(response));
					}
				})
			}
		})
	},

	'post|/cancelRoll': function(req, res, next) {
		var data = req.body;
		console.log(data);

		var session_key = data.session_key;
		var roll_id;

		var response = {
			msg: 'failed'
		}

		RollRoom.findOne({
			where: {
				roll_id: roll_id
			}
		}).then(function(roll) {
			if (!roll) {
				response.msg = 'roll do not exist'
				console.log(response);
				res.end(JSON.stringify(response));
			} else {
				Participators.findAll({
					where: {
						roll_id: roll.roll_id
					}
				}).then(function(participators) {
					roll.status = 'cancel';
					roll.save().then(function(canceled_roll) {
						if (typeof participators == 'undefined' || participators == null || participators.length == 0) {
							response.msg = 'success';
							console.log(response);
							res.end(JSON.stringify(response));
						} else {
							//bulkCreate
							var now = new Date().getTime();
							var messages = [];
							for (var i = 0; i < participators.length; i++) {
								var temp = {
									wechat_id: participators[i].wechat_id,
									message: '很不幸，抽奖 ' + canceled_roll.roll_id + ' 被取消了',
									sned_time: now,
									is_read: 0
								}
								messages.push(temp);
							}
							Message.bulkCreate(messages).then(function(new_messages) {
								response.msg = 'success';
								console.log(response);
								res.end(JSON.stringify(response));
							})
						}
					})
				})
			}
		})
	},

	'post|/uploadPrizePhoto': function(req, res, next) {
		//var data = req.body;
		//console.log(data);

		var form = new formidable.IncomingForm();
		form.uploadDir = './public/images/prizes_img';
		form.keepExtensions = true;
		form.parse(req, function(err, fields, files) {
			var name = files.file.path.split('\\');
			var myname = name[name.length-1];
			console.log("myname:" + myname);
			var response = {
				msg: 'success',
				file_path: config.server_url + '/images/prizes_img/' + myname
			};
			console.log(response);
			res.end(JSON.stringify(response));
		})
	},

	'post|/haveUnreadMessages': function(req, res, next) {
		var data = req.body;
		console.log(data);

		var session_key = data.session_key;

		var response = {
			msg: 'failed',
			haveUnreadMessages: null
		};

		User.findOne({
			where: {
				session_code: session_key
			}
		}).then(function(user) {
			if (!user) {
				res.end(JSON.stringify(response));
			} else {
				Message.findAll({
					where: {
						wechat_id: user.wechat_id,
						is_read: 0
					}
				}).then(function(messages) {
					response.msg = 'success';
					if (typeof messages == 'undefined' || messages == null || messages.length == 0) {
						response.haveUnreadMessages = false;
					} else {
						response.haveUnreadMessages = true;
					}
					console.log(response);
					res.end(JSON.stringify(response));
				})
			}
		})
	},

	'post|/getMyMessages': function(req, res, next) {
		var data = req.body;
		console.log(data);

		var session_key = data.session_key;
		var page = data.page;
		var isRead = data.isRead;
		if (typeof page != 'undefined')
			page = Number(data.page)-1;
		else {
			page = 0;
		}
		var page_size = 10;
		
		var response = {
			msg: 'failed',
			messages: []
		};

		var where;
		User.findOne({
			where: {
				session_code: session_key
			}
		}).then(function(user) {
			if (!user) {
				response.msg = 'session_key expired';
				res.end(JSON.stringify(response));
			} else {
				if (typeof isRead == 'undefined' || isRead == null) {
					where = {
						wechat_id: user.wechat_id,
					};
				} else {
					where = {
						wechat_id: user.wechat_id,
						is_read: isRead
					}
				}
				Message.findAll({
					where: where,
					offset: page * page_size,
					limit: page_size,
					order: [['send_time', 'DESC']]
				}).then(function(my_messages) {
					if (typeof my_messages == 'undefined' || my_messages == null || my_messages.length == 0) {
						response.msg = 'success';
						console.log(response);
						res.end(JSON.stringify(response));
					} else {
						for (var i = 0; i < my_messages.length; i++) {
							var temp = {
								message_id: my_messages[i].message_id,
								text: my_messages[i].message,
								send_time: my_messages[i].send_time,
								is_read: my_messages[i].is_read
							};
							my_messages[i].is_read = 1;
							my_messages[i].save();
							response.messages.push(temp);
						}
						response.msg = 'success';
						console.log(response);
						res.end(JSON.stringify(response));
					}
				})
			}
		})
	},

	'post|/setMessageIsRead': function(req, res, next) {
		var data = req.body;
		console.log(data);

		var session_key = data.session_key;
		var message_id = data.message_id;

		var response = {
			msg: 'failed',
			message_is_read: -1,
		};

		User.findOne({
			where: {
				session_code: session_key
			}
		}).then(function(user) {
			if (!user) {
				response.msg = 'session_key expired';
				res.end(JSON.stringify(response));
			} else {
				Message.findOne({
					where: {
						message_id: message_id,
						wechat_id: user.wechat_id
					}
				}).then(function(message) {
					if (message) {
						message.is_read = 1;
						message.save().then(function(updated_message) {
							if (updated_message) {
								response.message_is_read = updated_message.message_id;
								res.end(JSON.stringify(response));
							} else {
								res.end(JSON.stringify(response));
							}
						})
					} else {
						res.end(JSON.stringify(response));
					}
				})
			}
		})
	},

	'post|/getIndexRollItem': function(req, res, next) {
		var data = req.body;
		console.log(data);

		var session_key = data.session_key;
		var page = data.page;
		if (typeof page != 'undefined')
			page = Number(data.page)-1;
		else {
			page = 0;
		}
		var page_size = 6;
		RollRoom.findAll({
			where: {
				status: 'open'
			},
			offset: page * page_size,
			limit: page_size,
			order: [['create_time', 'DESC']]
		}).then(function(rolls) {
			var response = {
				msg: 'success',
				rolls: []
			};
			var people_count = {};
			var prize_imgs_array = {};

			Prizes.findAll({
				where: {
					roll_id: {$in: utils.listAttr(rolls, 'roll_id')}
				}
			}).then(function(prizes) {
				for (var i = 0; i < prizes.length; i++) {
					if (typeof prize_imgs_array[prizes[i].roll_id] == 'undefined') {
						prize_imgs_array[prizes[i].roll_id] = [];
						prize_imgs_array[prizes[i].roll_id].push(prizes[i].img_url);
					} else {
						prize_imgs_array[prizes[i].roll_id].push(prizes[i].img_url);
					}
				}

				for (var i = 0; i < rolls.length; i++) {
					var temp = {
						roll_id: rolls[i].roll_id,
						title: rolls[i].title,
						create_time: rolls[i].create_time,
						have_passwd: rolls[i].have_passwd,
						roll_type: rolls[i].roll_type,
						time_limit: rolls[i].time_limit,
						people_limit: rolls[i].people_limit,
						participators_count: rolls[i].participators_count,
						status: rolls[i].status,
						prize_imgs: prize_imgs_array[rolls[i].roll_id],
						creator_avatar: rolls[i].creator_avatar
					};
					response.rolls.push(temp);
				}
				console.log(response);
				res.end(JSON.stringify(response));
			});
		});
	},

	'post|/getParticipatedRollItem': function(req, res, next) {
		var data = req.body;
		console.log(data);

		var session_key = data.session_key;
		var page = data.page;
		if (typeof page != 'undefined')
			page = Number(data.page);

		var response = {
			msg: 'failed',
			rolls: []
		};

		User.findOne({
			where: {
				session_code: session_key
			}
		}).then(function(user) {
			if (!user) {
				response.msg = 'session_key expired';
				res.end(JSON.stringify(response));
			} else {
				Participators.findAll({
					where: {
						wechat_id: user.wechat_id
					}
				}).then(function(participators) {
					if (typeof participators == 'undefined' || participators == null || participators.length == 0) {
						response.msg = 'participate nothing';
						res.end(JSON.stringify(response));
					} else {
						RollRoom.findAll({
							where: {
								roll_id: {$in: utils.listAttr(participators, 'roll_id')}
							},
							order: [['create_time', 'DESC']]
						}).then(function(rolls) {
							var people_count = {};
							var prize_imgs_array = {};
			
							Prizes.findAll({
								where: {
									roll_id: {$in: utils.listAttr(rolls, 'roll_id')}
								}
							}).then(function(prizes) {
								Win.findAll({
									where: {
										roll_id: {$in: utils.listAttr(rolls, 'roll_id')},
										wechat_id: user.wechat_id
									}
								}).then(function(wins) {
									for (var i = 0; i < prizes.length; i++) {
										if (typeof prize_imgs_array[prizes[i].roll_id] == 'undefined') {
											prize_imgs_array[prizes[i].roll_id] = [];
											prize_imgs_array[prizes[i].roll_id].push(prizes[i].img_url);
										} else {
											prize_imgs_array[prizes[i].roll_id].push(prizes[i].img_url);
										}
									}

									for (var i = 0; i < rolls.length; i++) {
										var amIWin = null;
										for (var j = 0; j < wins.length; j++) {
											if (wins[j].wechat_id == user.wechat_id && wins[j].roll_id == rolls[i].roll_id) {
												amIWin = true;
												break;
											}
										}
										if (amIWin != true && rolls[i].status == 'end') {
											amIWin = false;
										}
										var temp = {
											roll_id: rolls[i].roll_id,
											title: rolls[i].title,
											create_time: rolls[i].create_time,
											have_passwd: rolls[i].have_passwd,
											roll_type: rolls[i].roll_type,
											time_limit: rolls[i].time_limit,
											people_limit: rolls[i].people_limit,
											participators_count: rolls[i].participators_count,
											status: rolls[i].status,
											prize_imgs: prize_imgs_array[rolls[i].roll_id],
											creator_avatar: rolls[i].creator_avatar,
											am_i_win: amIWin
										};
										response.rolls.push(temp);
									}
									response.msg = 'success';
									console.log(response);
									res.end(JSON.stringify(response));
								})
							});
						});
					}
				})
			}
		})
	},

	'post|/getCreatedRollItem': function(req, res, next) {
		var data = req.body;
		console.log(data);

		var session_key = data.session_key;
		var page = data.page;
		if (typeof page != 'undefined')
			page = Number(data.page);

		var response = {
			msg: 'failed',
			rolls: []
		};

		User.findOne({
			where: {
				session_code: session_key
			}
		}).then(function(user) {
			if (!user) {
				response.msg = 'session_key expired';
				res.end(JSON.stringify(response));
			} else {
				RollRoom.findAll({
					where: {
						wechat_id: user.wechat_id
					},
					order: [['create_time', 'DESC']]
				}).then(function(rolls) {
					// console.log('----------------------------------------------------------');
					// console.log(utils.listAttr(rolls, 'dataValues'));
					// console.log('----------------------------------------------------------');
					var people_count = {};
					var prize_imgs_array = {};
			
					Prizes.findAll({
						where: {
							roll_id: {$in: utils.listAttr(rolls, 'roll_id')}
						}
					}).then(function(prizes) {
						for (var i = 0; i < prizes.length; i++) {
							if (typeof prize_imgs_array[prizes[i].roll_id] == 'undefined') {
								prize_imgs_array[prizes[i].roll_id] = [];
								prize_imgs_array[prizes[i].roll_id].push(prizes[i].img_url);
							} else {
								prize_imgs_array[prizes[i].roll_id].push(prizes[i].img_url);
							}
						}

						for (var i = 0; i < rolls.length; i++) {
							var temp = {
								roll_id: rolls[i].roll_id,
								title: rolls[i].title,
								create_time: rolls[i].create_time,
								have_passwd: rolls[i].have_passwd,
								passwd: rolls[i].passwd,
								roll_type: rolls[i].roll_type,
								time_limit: rolls[i].time_limit,
								people_limit: rolls[i].people_limit,
								roll_desc: rolls[i].roll_desc,
								participators_count: rolls[i].participators_count,
								status: rolls[i].status,
								prize_imgs: prize_imgs_array[rolls[i].roll_id],
								creator_avatar: rolls[i].creator_avatar
							};
							response.rolls.push(temp);
						}
						response.msg = 'success';
						console.log(response);
						res.end(JSON.stringify(response));
					});
				});
			}
		})
	},

	'post|/isRollExist': function(req, res, next) {
		var data = req.body;
		console.log(data);

		var session_key = data.session_key;
		var roll_id = data.roll_id;

		var response = {
			msg: 'failed',
			isRollExist: false
		};

		RollRoom.findOne({
			where: {
				roll_id: roll_id
			}
		}).then(function(roll) {
			if (!roll) {
				res.end(JSON.stringify(response));
			} else {
				response.msg = 'success';
				response.isRollExist = true;
				res.end(JSON.stringify(response));
			}
		});
	},

	'post|/getRollDetail': function(req, res, next) {
		var data = req.body;
		console.log(data);

		var session_key = data.session_key;
		var roll_id = data.roll_id;

		var response = {
			msg: 'failed',
			detail: {}
		};

		RollRoom.findOne({
			where: {
				roll_id: roll_id
			}
		}).then(function(roll) {
			if (!roll) {
				res.end(JSON.stringify(response));
			} else {
				Participators.findAll({
					where: {
						roll_id: roll.roll_id
					}
				}).then(function(participators) {
					User.findAll({
						where: {
							wechat_id: {$in: utils.listAttr(participators, 'wechat_id')}
						}
					}).then(function(users) {
						Prizes.findAll({
							where: {
								roll_id: roll.roll_id
							}
						}).then(function(prizes) {
							var prize_imgs = utils.listAttr(prizes, 'img_url');
							var participators_info = [];
							// participators_info.nickname = utils.listAttr(participators, 'nickname');
							// participators_info.avatar_url = utils.listAttr(participators, 'avatar_url');
							for (var i = 0; i < participators.length; i++) {
								for (var j = 0; j < users.length; j++) {
									if (participators[i].wechat_id == users[j].wechat_id) {
										participators_info.push({
											nickname: users[j].nickname,
											avatar_url: users[j].avatar_url
										});
										break;
									}
								}
							}
							response.msg = 'success';
							response.detail.roll_id = roll.roll_id;
							response.detail.title = roll.title;
							response.detail.create_time = roll.create_time;
							response.detail.have_passwd = roll.have_passwd;
							response.detail.roll_type = roll.roll_type;
							if (roll.roll_type == 1) {
								response.detail.time_limit = roll.time_limit;
							} else if (roll.roll_type == 2) {
								response.detail.people_limit = roll.people_limit;
							}
							response.detail.selected_mode = roll.selected_mode;
							response.detail.participators_count = roll.participators_count;
							response.detail.participators_info = participators_info;
							response.detail.roll_desc = roll.roll_desc;
							response.detail.status = roll.status;
							response.detail.prize_imgs = prize_imgs;
							response.detail.creator_avatar = roll.creator_avatar;
							var user_with_prizes = [];
							response.detail.user_with_prizes = user_with_prizes;
							if (roll.status != 'end') {
								res.end(JSON.stringify(response));
								console.log(response);
							} else {
								Win.findAll({
									where: {
										roll_id: roll.roll_id
									}
								}).then(function(wins) {
									if (!wins) {
										res.end(JSON.stringify(response));
										console.log(response);
									} else {
										for (var i = 0; i < wins.length; i++) {
											for (var j = 0; j < users.length; j++) {
												if (wins[i].wechat_id == users[j].wechat_id) {
													wins[i].nickname = users[j].nickname;
													wins[i].avatar_url = users[j].avatar_url;
													for(var k = 0; k < prizes.length; k++) {
														if (wins[i].prize_id == prizes[k].prize_id) {
															wins[i].prize_img = prizes[k].img_url;
															break;
														}
													}
													break;
												}
											}
										}
										var temp = {};
										for (var i = 0; i < wins.length; i++) {
											if (!temp[wins[i].nickname]) {
												temp[wins[i].nickname] = 1;
												user_with_prizes.push({
													nickname: wins[i].nickname,
													avatar_url: wins[i].avatar_url,
													prize_imgs: [wins[i].prize_img]
												});
											} else {
												for (var j = 0; j < user_with_prizes.length; j++) {
													if (user_with_prizes[j].nickname == wins[i].nickname) {
														user_with_prizes[j].prize_imgs.push(wins[i].prize_img);
														break;
													}
												}
											}
										}
										response.detail.user_with_prizes = user_with_prizes;
										res.end(JSON.stringify(response));
										console.log(response);
									}
								})
							}
						})
					})
				})
			}
		})
	},

	'post|/amIParticipated': function(req, res, next) {
		var data = req.body;
		console.log(data);

		var session_key = data.session_key;
		var roll_id = data.roll_id;

		var response = {
			msg: 'failed',
			amIParticipated: null
		};

		User.findOne({
			where: {
				session_code: session_key
			}
		}).then(function(user) {
			if (!user) {
				response.msg = 'session_key expired';
				res.end(JSON.stringify(response));
			} else {
				Participators.findOne({
					where: {
						roll_id: roll_id,
						wechat_id: user.wechat_id
					}
				}).then(function(participated) {
					response.msg = 'success';
					if (!participated) {
						response.amIParticipated = false;
					} else {
						response.amIParticipated = true;
					}
					console.log(response);
					res.end(JSON.stringify(response));
				})
			}
		})
	},

	'post|/participateInRoll': function(req, res, next) {
		var data = req.body;
		console.log(data);

		var session_key = data.session_key.trim();
		var roll_id = data.roll_id;
		var passwd_user = data.passwd;
		if (typeof passwd_user != 'string')
			passwd_user = String(passwd_user);
		passwd_user = passwd_user.trim()

		RollRoom.findOne({
			where: {
				roll_id: roll_id
			}
		}).then(function(roll) {
			var response = {
				msg: 'failed',
			};
			if (!roll) {
				response.msg = 'roll ' + roll_id + ' do not exist';
				res.end(JSON.stringify(response));
			} else {
				var status = roll.status;
				var passwd = roll.passwd;
				if (roll.have_passwd && passwd_user != passwd) {
					response.msg = 'wrong password';
					res.end(JSON.stringify(response));
				} else if (status == 'closed') {
					response.msg = 'roll is closed';
					res.end(JSON.stringify(response));
				} else if (status == 'open') {
					User.findOne({
						where: {
							session_code: session_key
						}
					}).then(function(user) {
						if (!user) {
							response.msg = 'session_key is expired';
							res.end(JSON.stringify(response));
						} else {
							var now = new Date().getTime();
							if (roll.roll_type == 2 && roll.participators_count >= roll.people_limit) {
								response.msg = 'number of participators arrived'
							}
							roll.participators_count += 1;
							roll.save().then(function(updated_roll) {
								if (!updated_roll) {
									response.msg = 'saving roll info failed';
									res.end(JSON.stringify(response));
								} else {
									Participators.findOne({
										where: {
											roll_id: updated_roll.roll_id,
											wechat_id: user.wechat_id
										}
									}).then(function(participator) {
										if (participator) {
											response.msg = 'already participated';
											updated_roll.participators_count -= 1;
											updated_roll.save();
											res.end(JSON.stringify(response));
										} else {
											Participators.create({
												roll_id: roll.roll_id,
												wechat_id: user.wechat_id,
												avatar_url: user.avatar_url,
												time: now
											}).then(function(new_participator) {
												if (!new_participator) {
													response.msg = 'saving participator info failed';
													updated_roll.participators_count -= 1;
													updated_roll.save();
													res.end(JSON.stringify(response));
												} else {
													response.msg = 'success';
													console.log(response);
													res.end(JSON.stringify(response));
												}
											})
										}
									})
								}
							})
						}
					})
				}
			}
		})
	},

	'post|/beginToRoll': function(req, res, next) {
		var data = req.body;
		console.log(data);

		var session_key = data.session_key;
		var roll_id = data.roll_id;

		var response = {
			msg: 'failed',
			who_win_the_prizes: []
		};

		User.findOne({
			where: {
				session_code: session_key
			}
		}).then(function(user) {
			if (!user) {
				response.msg = 'session_key is expired';
				res.end(JSON.stringify(response));
			} else {
				RollRoom.findOne({
					where: {
						roll_id: roll_id
					}
				}).then(function(roll) {
					if (!roll) {
						response.msg = 'roll ' + roll_id + ' do not exist';
						res.end(JSON.stringify(response));
					} else {
						if (roll.wechat_id != user.wechat_id) {
							response.msg = 'permission deny';
							res.end(JSON.stringify(response));
						} else if (roll.status != 'open') {
							response.msg = 'roll ' + roll_id + ' is not open';
							res.end(JSON.stringify(response));
						} else {
							Participators.findAll({
								where: {
									roll_id: roll.roll_id
								}
							}).then(function(participators) {
								User.findAll({
									where: {
										wechat_id: {$in: utils.listAttr(participators, 'wechat_id')}
									}
								}).then(function(users) {
									Prizes.findAll({
										where: {
											roll_id: roll.roll_id
										}
									}).then(function(prizes) {
										var num_of_prizes = prizes.length;
										var num_of_participators = participators.length;
										if (num_of_participators == 0) {
											response.msg = 'not enough participators';
											res.end(JSON.stringify(response));
										} else if (roll.selected_mode == 1) {
											var wins = [];
											var selected = utils.randomInt(num_of_participators);
											var exchange_codes = [];
											for (var i = 0; i < num_of_prizes; i++) {
												var exchange_code = utils.generateExchangeCode();
												wins.push({
													roll_id: roll.roll_id,
													wechat_id: participators[selected].wechat_id,
													prize_id: prizes[i].prize_id,
													exchange_code: exchange_code,
													exchanged: 0
												});
												
												exchange_codes.push(exchange_code);
											}
											var selected_nickname;
											var selected_user;
											var now = new Date().getTime();
											for (var i = 0; i < users.length; i++) {
												if (users[i].wechat_id == participators[selected].wechat_id) {
													selected_nickname = users[i].nickname;
													selected_user = users[i];
													break;
												}
											}
											response.who_win_the_prizes.push({
												nickname: selected_user.nickname,
												avatar_url: selected_user.avatar_url,
												prizes: utils.listAttr(prizes, 'img_url')
											})
											roll.status = 'end';
											roll.save();
											Win.bulkCreate(wins);

											Message.create({
												wechat_id: roll.wechat_id,
												message: '抽奖 ' + roll.roll_id + ' 已开奖，' + selected_nickname + '赢取了所有的奖品。',
												send_time: now,
												is_read: 0
											});
											Message.create({
												wechat_id: participators[selected].wechat_id,
												message: '抽奖 ' + roll.roll_id + ' 已开奖，你赢取了所有的奖品。你的兑换码是' + exchange_codes.join(', '),
												send_time: now,
												is_read: 0
											}).then(function(new_message) {
												response.msg = 'success';
												console.log(response);
												res.end(JSON.stringify(response));
											})
										} else {
											var wins = [];
											var selected = [];
											for (var i = 0; i < num_of_prizes; i++) {
												var choice = utils.randomInt(num_of_participators);
												var selected_nickname;
												var selected_user;
												var now = new Date().getTime();
												for (var j = 0; j < users.length; j++) {
													if (users[j].wechat_id == participators[choice].wechat_id) {
														selected_nickname = users[j].nickname;
														selected_user = users[j];
														break;
													}
												}
												var exchange_code = utils.generateExchangeCode();
												wins.push({
													roll_id: roll.roll_id,
													wechat_id: participators[choice].wechat_id,
													prize_id: prizes[i].prize_id,
													exchange_code: exchange_code,
													exchanged: 0
												});
												var temp = null;
												for (var j = 0; j < response.who_win_the_prizes.length; j++) {
													if (response.who_win_the_prizes[j].nickname == selected_user.nickname) {
														temp = response.who_win_the_prizes[j];
														break;
													}
												}
												if (temp == null) {
													var prize_imgs = [prizes[i].img_url];
													response.who_win_the_prizes.push({
														nickname: selected_user.nickname,
														avatar_url: selected_user.avatar_url,
														prizes: prize_imgs
													});
												} else {
													temp.prizes.push(prizes[i].img_url);
												}
												
												Message.create({
													wechat_id: participators[choice].wechat_id,
													message: '抽奖 ' + roll.roll_id + ' 已开奖，你被选中了。你的兑换码是' + exchange_code,
													send_time: now,
													is_read: 0
												});
											}
											Message.create({
												wechat_id: roll.wechat_id,
												message: '抽奖 ' + roll.roll_id + ' 已开奖，中奖者联系信息将在其兑奖后提供',
												send_time: now,
												is_read: 0
											});
											Win.bulkCreate(wins);
											roll.status = 'end';
											roll.save();
											response.msg = 'success';
											console.log(response);
											res.end(JSON.stringify(response));
										}
									})
								})
							})
						}
					}
				})
			}
		})
	},

	'post|/exchangePrizes': function(req, res, next) {
		var data = req.body;
		console.log(data);

		var session_key = data.session_key;
		var exchange_code = data.exchange_code;
		var email = data.email;
		var phone = data.phone;
		var wechat = data.wechat;
		var qq = data.qq;

		var response = {
			msg: 'failed'
		};

		User.findOne({
			where: {
				session_code: session_key
			}
		}).then(function(user) {
			if (!email && !phone && !wechat && !qq) {
				response.msg = 'at least one kind of contact infomation is needed';
				res.end(JSON.stringify(response));
			} else if (!user) {
				response.msg = 'session_key expired';
				res.end(JSON.stringify(response));
			} else {
				Win.findOne({
					where: {
						wechat_id: user.wechat_id,
						exchange_code: exchange_code
					}
				}).then(function(win) {
					if (!win) {
						response.msg = 'wrong exchange_code';
						console.log(response);
						res.end(JSON.stringify(response));
					} else {
						var contact_information = '';
						if (email) {
							win.email = email;
							contact_information += email + ', ';
						}
						if (phone) {
							win.phone = phone;
							contact_information += phone + '(电话), ';
						}
						if (wechat) {
							win.wechat = wechat;
							contact_information += wechat + '(微信), ';
						}
						if (qq) {
							win.qq = qq;
							contact_information += qq + '(QQ)';
						}


						var now = new Date().getTime();
						RollRoom.findOne({
							where: {
								roll_id: win.roll_id
							}
						}).then(function(roll) {
							Message.create({
								wechat_id: roll.wechat_id,
								message: '抽奖 ' + roll.roll_id + ' 的中奖者已兑奖，他(她)的联系方式是：' + contact_information,
								send_time: now,
								is_read: 0
							}).then(function(message) {
								win.exchange_code = null;
								win.exchanged = 1;
								win.save().then(function(updated_win) {
									response.msg = 'success';
									console.log(response);
									res.end(JSON.stringify(response));
								})
							})
						})
					}
				})
			}
		})
	},

	'get|/test': function(req, res, next) {
		res.writeHead(200, {'content-type': 'text/html'});
		res.end('hello world! I am yang.<br />' + Date());
	}
}


module.exports = api_roll;