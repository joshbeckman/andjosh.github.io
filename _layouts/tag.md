---
layout: default
---
<p>{{ page.title }}</p>
<hr/>
<div class="posts">
  {% if site.tags[page.slug] %}
    {% for post in site.tags[page.slug] %}
      <div class="post">
        {% if post.image %}
          <div class="post-image">
            <img src="{{ post.image }}" alt="{{ post.title }}"/>
          </div>
        {% elsif post['mf-photo'] %}
          <div class="post-image">
            <img src="{{ post['mf-photo'] }}" alt="{{ post['mf-photo'] }}"/>
          </div>
        {% endif %}
        {% if post.title and post.title != '' %}
            <h2 class="post-title">
              {{ post.title }}
            </h2>
            <a href="{{ post.url }}" class="post-date">
              {{ post.date | date_to_string }}
            </a>
        {% else %}
            <a href="{{ post.url }}" class="post-date">
              {{ post.date | date_to_string }}
            </a>
        {% endif %}
      </div>
    {% endfor %}
  {% else %}
    <p>There are no posts in this tag.</p>
  {% endif %}
</div>
