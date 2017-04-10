#Auth code

    authorize(
	   client_id,
	   response_type,
	   scope,
	   redirect_uri,
	   state
	)



	flow / grant       | response_type       |  scopes               | response                            | standard |
	-------------------+---------------------+-----------------------+-------------------------------------+----------+
	                   | code                |                       | access_token                        |  oauth2  |
	                   | code                | offline_access        | access_token refresh_token          |    ??    |
	Authorization Code | code                | openid                | id_token access_token               |  openid  |
	                   | code                | openid offline_access | id_token access_token refresh_token |  openid  |
	-------------------+---------------------+-----------------------+-------------------------------------+----------+
	                   | token               |                       | access_token                        |  oauth2  |
	Implicit           | id_token            | openid                | id_token                            |  openid  |
	                   | token id_token      | openid                | id_token access_token               |  openid  |
	-------------------+---------------------+-----------------------+-------------------------------------+----------+
	                   | code token          |                       | access_token                        |  oauth2  |
	                   | code token          | offline_access        | access_token refresh_token          |    ??    |
	                   | code id_token       | openid                | id_token                            |  openid  |
	Hybrid             | code id_token       | openid offline_access | id_token refresh_token              |  openid  |
	                   | code token id_token | openid                | id_token access_token               |  openid  |
	                   | code token id_token | openid offline_access | id_token access_token refresh_token |  openid  |
	-------------------+---------------------+-----------------------+-------------------------------------+----------+

openid: http://openid.net/specs/openid-connect-core-1_0.html
oauth2: http://tools.ietf.org/html/rfc6749