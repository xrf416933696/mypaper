package com.bupt.xrf.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.bupt.xrf.entity.ReqGood;

public interface IReqGoodService {

	public Map<String, Object> findbypage(int page, int rows);
	
	public List<ReqGood> findall();

	public void addreqgood(HashMap<String, Object> rg);

	public void emptyreqgood();
	
}
